import * as gc from "@sg/sg-game-client";
import { RoundHistoryStore } from "@sg/sg-game-client/dist/game/round-histories";
import { ROUND_STATE, RoundTimeStore } from "@sg/sg-game-client/dist/game/rounds";
import { SettlementStore } from "@sg/sg-game-client/dist/game/settlements";
import { observer, render } from "@sg/sg-observer";
import { ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import { setting } from "../game-settings";
import { ErrorBoundary } from "./components/error-boundary";
// import { Loading } from "./components/loading";
import { gameStateService } from "./services/game-state.service";
import Styles from "./styles/rng-soccer-settlement.module.scss";

import type { RNGSoccerResult } from '../type';
import type { IPropsObserver, IStateObserver } from '../../../../_shared/components/observer-component/observer-component';
import Loading from "libs/hot-league-wall/src/_shared/components/loading";

const DEFAULT_RESULT: RNGSoccerResult = {
    homeScore: 0,
    awayScore: 0,
    homeCard: { card: 0, type: 0 },
    awayCard: { card: 0, type: 1 },
};

interface IRNGSoccerSettlementResultState extends IStateObserver {
    result?: RNGSoccerResult;
    roundState: string;
    isAnimationResult: boolean;
    isLoading: boolean;
    error?: Error;
    isFinish: boolean;
    isFinishShowResult: boolean;
    isHideAllCards: boolean;
}

@observer(setting.mainObserverNamespace)
export default class RNGSoccerSettlementResult extends ObserverComponent<IPropsObserver, IRNGSoccerSettlementResultState> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
            result: undefined,
            roundState: '',
            isAnimationResult: false,
            isLoading: true,
            error: undefined,
            isFinish: false,
            isFinishShowResult: false,
            isHideAllCards: false,
        };
    }

    @render(gc.Settlements.SettlementStore, (store) => store.isFinishedShowResult)
    finishShowResult(isFinishedShowResult: boolean) {
        this.setState({ isFinishShowResult: isFinishedShowResult });
    }

    @render(RoundTimeStore, (store) => store.isStartingRound)
    private handleStartNewRound(isStartingRound: boolean): void {
        this.setState({ isHideAllCards: isStartingRound });
    }

    @render(RoundTimeStore, (store) => store.roundState)
    private handleRoundState(roundState: string): void {
        try {
            if (
                roundState === ROUND_STATE.STARTING_ROUND ||
                roundState === ROUND_STATE.PLACING_BET ||
                roundState === ROUND_STATE.LOCKING_BET
            ) {
                this.setState({ isFinish: false });
            }
            gameStateService.handleRoundState(roundState);
            this.setState({ roundState, isLoading: false, isFinishShowResult: false });
        } catch (error) {
            this.setState({ error: error as Error });
        }
    }

    @render(SettlementStore, (store) => store.currentFinish, {
        fireImmediately: false,
    })
    private handleCurrentFinish(currentFinish: gc.GameServiceMessage.Finish): void {
        try {
            const result = gameStateService.handleSettlement(currentFinish);
            if (result && gameStateService.validateResult(result)) {
                this.setState({ result, isAnimationResult: true, isLoading: false, isFinish: true });
            }
        } catch (error) {
            this.setState({ error: error as Error });
        }
    }

    @render(RoundHistoryStore, (store) => store.firstJoinGameHistory)
    private handleJoinGameAndShowResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory): void {
        const { roundState } = this.state;

        if (roundState === ROUND_STATE.PLACING_BET || roundState === ROUND_STATE.LOCKING_BET) {
            return;
        }

        try {
            const result = gameStateService.handleGameHistory(firstJoinGameHistory);
            if (result && gameStateService.validateResult(result)) {
                this.setState({ result, isLoading: false, isFinish: true, isFinishShowResult: true });
            }
        } catch (error) {
            this.setState({ error: error as Error });
        }
    }

    private renderScoreDisplay(): JSX.Element | null {
        const { result, isAnimationResult, isFinish, roundState, isFinishShowResult, isHideAllCards } = this.state;
        const language = this.props.language || gc.Translator.getCurrentLanguageId();

        if (!result || !isFinish || roundState === ROUND_STATE.PLACING_BET || roundState === ROUND_STATE.LOCKING_BET) {
            return (
                <div className={Styles['score-display']}>
                    <div className={Styles['score']}>
                        <span>{DEFAULT_RESULT.homeScore}</span>
                    </div>
                    <div className={Styles['score']}>
                        <span>{DEFAULT_RESULT.awayScore}</span>
                    </div>
                </div>
            );
        }

        return (
            <div className={Styles['score-display']}>
                <div className={Styles['score']}>
                    <span>{result.homeScore}</span>
                </div>
                <div className={Styles['score']}>
                    <span>{result.awayScore}</span>
                </div>
            </div>
        );
    }

    private renderContent(): JSX.Element {
        const { isLoading, error, result, isFinish, roundState } = this.state;

        if (error) {
            throw error;
        }

        if (isLoading) {
            return <Loading />;
        }

        return (
            <div className={Styles['settlement-container']}>
                <div className={Styles['container-result']}>
                    {this.renderScoreDisplay()}
                </div>
            </div>
        );
    }

    render(): JSX.Element {
        return <ErrorBoundary>{this.renderContent()}</ErrorBoundary>;
    }
} 