import * as gc from "@sg/sg-game-client";
import { Settlements } from '@sg/sg-game-client';
import { RoundHistoryStore } from "@sg/sg-game-client/dist/game/round-histories";
import { ROUND_STATE, RoundTimeStore } from "@sg/sg-game-client/dist/game/rounds";
import { SettlementStore } from "@sg/sg-game-client/dist/game/settlements";
import { render, handle } from "@sg/sg-observer";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import { FishPrawnCrabResult } from "../type";
import Styles from "./fish-prawn-crab-animations.module.scss";
import { gameStateService } from "./services/game-state.service";
import FishPrawnCrabDice, { FishPrawnCrabSymbol } from "../../../../_shared/components/fish-prawn-crab-dice";
import { Size } from "../../../../_shared/constants";
import { convertValueToSymbol, symbolToStringMap } from "../fish-prawn-crab-utils";
import { AnimatedDiceSet } from '../../../../_shared/components/fish-prawn-crab-dice/animated-dice';
import { ResultDisplay } from "./result-display";

const DEFAULT_RESULT = {};

export interface IFishPrawnCrabSettlementResultState extends IStateObserver {
    result: gc.GameServiceMessage.TResult;
    roundState: string;
    isAnimationResult: boolean;
    isFinishShowResult: boolean;
    settlementResult: gc.GameServiceMessage.TSettlementResult;
    winningSymbols: string[];
    isResultUpdated: boolean;
    isAnimationComplete: boolean;
}

export default class FishPrawnCrabSettlementResult extends ObserverComponent<IPropsObserver, IFishPrawnCrabSettlementResultState> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
            result: DEFAULT_RESULT,
            roundState: '',
            isAnimationResult: false,
            isFinishShowResult: false,
            settlementResult: {},
            winningSymbols: [],
            isResultUpdated: false,
            isAnimationComplete: false,
        };
    }

    @handle(Settlements.SettlementUIHandlers.FinishedShowResult, (handler) => handler.handleFinishedShowResult())
    protected handleFinishedShowResult() {
        // Removed unused timestamp code
    }

    @handle(Settlements.SettlementUIHandlers.FinishedPlayAnimation, (handler) => handler.handle())
    protected handleFinishedPlayAnimation() {
        // Removed unused timestamp code
    }

    @render(RoundTimeStore, (store) => store.roundState)
    private handleRoundState(roundState: string) {
        if (roundState === ROUND_STATE.STARTING_ROUND || roundState === ROUND_STATE.PLACING_BET) {
            this.setState({
                isFinishShowResult: false,
                result: DEFAULT_RESULT,
                settlementResult: {},
                winningSymbols: [],
                isResultUpdated: false,
                isAnimationResult: false,
                isAnimationComplete: false
            });
        }

        if (roundState === ROUND_STATE.SHOW_RESULT) {
            this.setState({ isResultUpdated: true });
        }

        if (roundState === ROUND_STATE.SHOW_ANIMATION_RESULT) {
            this.setState({
                roundState,
                isAnimationResult: true,
                isAnimationComplete: false
            });
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

        const winningSymbols = this.getWinningSymbols(settlementResult);
        this.setState({
            result,
            isAnimationResult: true,
            isFinishShowResult: false,
            settlementResult,
            winningSymbols,
            isResultUpdated: true
        });
    }

    private getWinningSymbols(settlementResult: gc.GameServiceMessage.TSettlementResult): string[] {
        const winningSymbols: string[] = [];

        Object.entries(settlementResult).forEach(([key, value]) => {
            if (value) {
                winningSymbols.push(key);
            }
        });

        return winningSymbols;
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
                isFinishShowResult: true
            });
        }
        const lastRound = firstJoinGameHistory?.roundHistory;
        if (lastRound) {
            const winningSymbols = this.getWinningSymbols(lastRound?.settlementResult);
            this.setState({
                result: lastRound?.result,
                settlementResult: lastRound?.settlementResult,
                winningSymbols
            });
        }
    }

    @render(gc.Settlements.SettlementStore, (store) => store.isFinishedShowResult)
    finishShowResult(isFinishedShowResult: boolean) {
        this.setState({ isFinishShowResult: isFinishedShowResult });
    }

    renderWinnerDisplay = () => {
        const { settlementResult, result, isAnimationComplete } = this.state;

        if (!settlementResult || Object.keys(settlementResult).length === 0 && result) {
            return null;
        }

        return this.state.isAnimationComplete ? <ResultDisplay
            result={result}
            language={this.props.language}
        /> : null;
    };

    isWinningSymbol = (symbol: string | number): boolean => {
        if (typeof symbol === 'string' && this.state.winningSymbols.includes(symbol)) {
            return true;
        }

        const stringSymbol = symbolToStringMap[symbol as number];

        const isWinning = stringSymbol && this.state.winningSymbols.includes(stringSymbol);

        return isWinning;
    };

    renderIcons = (result: gc.GameServiceMessage.TResult) => {
        const { isAnimationResult, isAnimationComplete } = this.state;

        const resultSymbols = Object.entries(result).map(([key, value]) => {
            return convertValueToSymbol(value);
        });

        const handleAnimationComplete = () => {
            this.setState({ isAnimationComplete: true });
            this.handleFinishedShowResult();

            setTimeout(() => {
                this.handleFinishedPlayAnimation();
            }, 500);
        };

        // Calculate animation parameters
        const animationDuration = 3000; // ms
        const staggerDelay = 150; // ms

        // Removed unused timestamp logging
        if (!isAnimationResult) {
            this.setState({ isAnimationComplete: true });
        }

        return (
            <div className={`${Styles['container-bets']} ${isAnimationResult ? Styles['has-animation'] : ''}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <div className={Styles['result-container']} style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '10px 0', position: 'relative' }}>
                    {isAnimationResult ? (
                        <AnimatedDiceSet
                            finalSymbols={resultSymbols}
                            size={Size.large}
                            animationDuration={animationDuration}
                            onAllAnimationsComplete={handleAnimationComplete}
                            staggerDelay={staggerDelay}
                        />
                    ) : (
                        Object.entries(result).map(([key, value], index) => {
                            const symbol = convertValueToSymbol(value);
                            const isWinning = this.isWinningSymbol(symbol);
                            return (
                                <div key={index} className={`${Styles['result-item']} ${isWinning ? Styles['winning-symbol'] : ''}`} style={{ transition: 'all 0.3s ease' }}>
                                    <FishPrawnCrabDice
                                        symbol={symbol}
                                        size={Size.large}
                                    />
                                </div>
                            );
                        })
                    )}
                </div>
                {this.renderWinnerDisplay()}
            </div>
        );
    };

    renderNoResultIcons = (): JSX.Element => {
        return (
            <div className={Styles['container-bets']} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <div className={Styles['result-container']} style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '10px 0' }}>
                    <div className={`${Styles['dice-empty']}`}>
                        <FishPrawnCrabDice symbol={FishPrawnCrabSymbol.EMPTY} size={Size.large} />
                    </div>
                    <div className={`${Styles['dice-empty']}`}>
                        <FishPrawnCrabDice symbol={FishPrawnCrabSymbol.EMPTY} size={Size.large} />
                    </div>
                    <div className={`${Styles['dice-empty']}`}>
                        <FishPrawnCrabDice symbol={FishPrawnCrabSymbol.EMPTY} size={Size.large} />
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const isEmpty = (obj: object): boolean => {
            return !obj || Object.keys(obj).length === 0;
        };

        const { result, isResultUpdated } = this.state;

        if (!isResultUpdated || isEmpty(result as object)) {
            return (
                <div className={Styles.settlementContainer}>
                    {this.renderNoResultIcons()}
                </div>
            );
        }

        return (
            <div className={Styles.settlementContainer}>
                {this.renderIcons(result)}
            </div>
        );
    }
} 