import * as gc from "@sg/sg-game-client";
import React from "react";
import { RoundHistoryStore } from "@sg/sg-game-client/dist/game/round-histories";
import { RoundTimeStore } from "@sg/sg-game-client/dist/game/rounds";
import { render } from "@sg/sg-observer";
import { observer } from "@sg/sg-observer";
import {
    ObserverComponent,
    type IPropsObserver,
    type IStateObserver,
} from "../../../../_shared/components/observer-component/observer-component";
import { ROUND_STATE } from "@sg/sg-game-client/dist/game/rounds";
import { BigSmallResult } from "../type";
import { SettlementStore } from "@sg/sg-game-client/dist/game/settlements";
import { gameStateService } from "./services/game-state.service";
import { Loading } from "../../baccarat/settlement-result/components/loading";
import { ErrorBoundary } from "../../baccarat/settlement-result/components/error-boundary";
import styles from "./styles.module.scss";
import { DiceDisplay } from "./components/dice-display";

const DEFAULT_RESULT: BigSmallResult = {
    dice1: 0,
    dice2: 0,
    dice3: 0,
};

export interface IBigSmallSettlementResultState extends IStateObserver {
    result?: BigSmallResult;
    roundState: string;
    isAnimationResult: boolean;
    isLoading: boolean;
    error?: Error;
}

export default class BigSmallSettlementResult extends ObserverComponent<IPropsObserver, IBigSmallSettlementResultState> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
            result: {
                dice1: 0,
                dice2: 0,
                dice3: 0,
            },
            roundState: "",
            isAnimationResult: false,
            isLoading: false,
            error: undefined,
        };
    }

    @render(RoundTimeStore, (store) => store.roundState)
    private handleRoundState(roundState: string): void {
        try {
            gameStateService.handleRoundState(roundState);
            this.setState({ roundState, isLoading: false });
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
                this.setState({ result, isAnimationResult: true, isLoading: false });
            }
        } catch (error) {
            this.setState({ error: error as Error });
        }
    }

    @render(RoundHistoryStore, (store) => store.firstJoinGameHistory)
    private handleJoinGameAndShowResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory): void {
        try {
            const result = gameStateService.handleGameHistory(firstJoinGameHistory);
            if (result && gameStateService.validateResult(result)) {
                this.setState({ result, isLoading: false });
            }
        } catch (error) {
            this.setState({ error: error as Error });
        }
    }

    private renderDiceDisplay() {
        const { result, isAnimationResult, roundState } = this.state;

        if (!result || roundState === ROUND_STATE.PLACING_BET || roundState === ROUND_STATE.LOCKING_BET) {
            return (
                <div className={styles.settlementContainer}>
                    <DiceDisplay
                        result={DEFAULT_RESULT}
                        isAnimationResult={false}
                    />
                </div>
            );
        }

        return (
            <div className={styles.settlementContainer}>
                <DiceDisplay result={result} isAnimationResult={isAnimationResult} />
            </div>
        );
    }

    private renderContent(): JSX.Element {
        const { isLoading, error } = this.state;

        if (error) {
            throw error;
        }

        if (isLoading) {
            return <Loading message="Loading game results..." />;
        }

        return <div>{this.renderDiceDisplay()}</div>;
    }

    render(): JSX.Element {
        return <ErrorBoundary>{this.renderContent()}</ErrorBoundary>;
    }
}
