import * as gc from "@sg/sg-game-client";
import { RoundHistoryStore } from "@sg/sg-game-client/dist/game/round-histories";
import { ROUND_STATE, RoundTimeStore } from "@sg/sg-game-client/dist/game/rounds";
import { SettlementStore } from "@sg/sg-game-client/dist/game/settlements";
import { render } from "@sg/sg-observer";
import { WinnerDisplay } from "../../../../_shared/components/winner-display/winner-display";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import { FishPrawnCrabResult } from "../type";
import Styles from "./fish-prawn-crab-animations.module.scss";
import { gameStateService } from "./services/game-state.service";
import FishPrawnCrabDice, { FishPrawnCrabSymbol, diceValueToSymbol } from "../../../../_shared/components/fish-prawn-crab-dice";
import { Size } from "../../../../_shared/constants";
import { constants } from "../constants";
import { convertValueToSymbol } from "../fish-prawn-crab-utils";

export interface IFishPrawnCrabSettlementResultState extends IStateObserver {
    result: gc.GameServiceMessage.TResult;
    roundState: string;
    isAnimationResult: boolean;
    win: number;
    isFinishShowResult: boolean;
    settlementResult: gc.GameServiceMessage.TSettlementResult;
}

export default class FishPrawnCrabSettlementResult extends ObserverComponent<IPropsObserver, IFishPrawnCrabSettlementResultState> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
            result: {},
            roundState: '',
            isAnimationResult: false,
            win: 0,
            isFinishShowResult: false,
            settlementResult: {},
        };
    }

    @render(RoundTimeStore, (store) => store.roundState)
    private handleRoundState(roundState: string) {
        if (roundState === ROUND_STATE.STARTING_ROUND || roundState === ROUND_STATE.PLACING_BET || roundState === ROUND_STATE.LOCKING_BET) {
            this.setState({ isFinishShowResult: false, result: {}, settlementResult: {} });
        }
        this.setState({ roundState });
    }

    @render(SettlementStore, (store) => store.currentFinish, {
        fireImmediately: false,
    })
    private renderCurrentFinish(currentFinish: gc.GameServiceMessage.Finish) {
        if (!currentFinish) {
            return;
        }
        const { result, settlementResult } = currentFinish;

        if (!result || !settlementResult) {
            return;
        }

        this.setState({ result, isAnimationResult: true, isFinishShowResult: false, settlementResult });
    }

    @render(RoundHistoryStore, (store) => store.firstJoinGameHistory)
    private handleJoinGameAndShowResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory) {
        const { roundState } = this.state;

        if (roundState === ROUND_STATE.PLACING_BET || roundState === ROUND_STATE.LOCKING_BET) {
            return;
        }

        if (!firstJoinGameHistory) {
            return;
        }

        const result = gameStateService.handleGameHistory(firstJoinGameHistory);
        if (result && gameStateService.validateResult(result as FishPrawnCrabResult)) {
            this.setState({
                result,
                isFinishShowResult: true,
            });
        }
        const lastRound = firstJoinGameHistory?.roundHistory;
        if (lastRound) {
            this.setState({ result: lastRound?.result, settlementResult: lastRound?.settlementResult });
        }
    }

    @render(gc.Settlements.SettlementStore, (store) => store.isFinishedShowResult)
    finishShowResult(isFinishedShowResult: boolean) {
        this.setState({ isFinishShowResult: isFinishedShowResult });
    }

    @render(gc.Settlements.SettlementStatusStore, (store) => store.settlementStatus, {
        fireImmediately: false,
    })
    assignStatus(settlementStatus: any) {
        this.setState({ win: settlementStatus.bet });
    }

    renderWinnerDisplay = () => {
        const { settlementResult, isFinishShowResult } = this.state;
        const t = (key) => gc.Translator.t(key, { lng: this.props.language || '' });
        let result = '';

        Object.entries(settlementResult).forEach(([key, value]) => {
            if (value) {
                result = t(`FishPrawnCrab.${key}_win`);
            }
        });

        return isFinishShowResult && <WinnerDisplay resultText={result} className={Styles['fish-prawn-crab-result']} />;
    };

    renderIcons = (result: gc.GameServiceMessage.TResult) => {
        return (
            <div className={`${Styles['container-bets']} ${this.state.isAnimationResult ? Styles['has-animation'] : ''}`}>
                <div className={Styles['result-container']}>
                    {Object.entries(result).map(([key, value], index) => {
                        const symbol = convertValueToSymbol(value);
                        return (
                            <div className={Styles['result-item']} key={index}>
                                <FishPrawnCrabDice
                                    symbol={symbol}
                                    size={Size.large}
                                />
                            </div>
                        );
                    })}
                </div>
                {this.renderWinnerDisplay()}
            </div>
        );
    };

    renderNoResultIcons = (): JSX.Element => {
        return (
            <div className={Styles['result-container']}>
                <FishPrawnCrabDice symbol={FishPrawnCrabSymbol.EMPTY} size={Size.large} />
                <FishPrawnCrabDice symbol={FishPrawnCrabSymbol.EMPTY} size={Size.large} />
                <FishPrawnCrabDice symbol={FishPrawnCrabSymbol.EMPTY} size={Size.large} />
            </div>
        );
    };

    render() {
        const isEmpty = (obj: object): boolean => {
            return JSON.stringify(obj) === '{}';
        };

        const { result, roundState } = this.state;

        if (!result || isEmpty(result as object) || roundState === ROUND_STATE.PLACING_BET || roundState === ROUND_STATE.LOCKING_BET) {
            return this.renderNoResultIcons();
        }
        return (
            <div>
                <div>{this.renderIcons(result)}</div>
            </div>
        );
    }
} 