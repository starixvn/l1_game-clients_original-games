import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import React from "react";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import styles from "./color-game-round-history.module.scss";
import ColorGameRoundHistoryItem from "./color-game-round-history-item";
import EmptyDiceRow from "./empty-dice-row";
import { MAX_DISPLAYED_ROUNDS } from "../constants/color-game-constants";
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds';
import { blinkRoundItem, emptyRoundItem } from "../constants";
import { animationStateTransmitter } from '../transmitters/animation-state.transmitter';

const blinkDefaultRoundItem = {
    roundId: -1,
    result: blinkRoundItem,
    createdAt: new Date().toISOString(),
    settlementResult: {},
    date: new Date().toISOString(),
} as gc.RoundHistories.RoundHistory;

const emptyDefaultRoundItem = {
    roundId: -2,
    result: emptyRoundItem,
    createdAt: new Date().toISOString(),
    settlementResult: {},
    date: new Date().toISOString(),
} as gc.RoundHistories.RoundHistory;


export interface IColorGameRoundHistoryProps extends IPropsObserver {
    language: string;
}

export interface IColorGameRoundHistoryState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
    roundState: string;
    isFinishedShowResult: boolean;
    hasBlink: boolean;
    isAnimationComplete: boolean;
    fullRoundHistory: gc.RoundHistories.RoundHistory[];
}

export default class ColorGameRoundHistory extends ObserverComponent<IColorGameRoundHistoryProps, IColorGameRoundHistoryState> {
    constructor(props: IColorGameRoundHistoryProps) {
        super(props);
        this.state = {
            dispose: null,
            rounds: [],
            roundState: '',
            isFinishedShowResult: false,
            hasBlink: false,
            isAnimationComplete: false,
            fullRoundHistory: [],
        };
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(rounds: gc.RoundHistories.RoundHistory[]) {
        this.setState({ fullRoundHistory: rounds });
        if (rounds.length > 0) {
            this.setState({ rounds: [emptyDefaultRoundItem, ...rounds.slice(0, MAX_DISPLAYED_ROUNDS)] });
        }
        else {
            // setTimeout(() => {
            //     this.setState({ rounds: [emptyDefaultRoundItem, ...rounds.slice(0, MAX_DISPLAYED_ROUNDS)] });
            // }, 1000);
        }
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundState)
    renderCountDownTimerState(roundState: string) {
        const hasBlink = roundState === ROUND_STATE.LOCKING_BET || roundState === ROUND_STATE.SHOW_ANIMATION_RESULT;
        this.setState({ roundState, hasBlink });
    }

    @render(gc.Settlements.SettlementStore, (store) => store.isFinishedShowResult)
    finishShowResult(isFinishedShowResult: boolean) {
        this.setState({ isFinishedShowResult });
    }

    private handleAnimationComplete = (isComplete: boolean) => {
        // this.setState({ isAnimationComplete: isComplete });
        this.setState({ rounds: [emptyDefaultRoundItem, ...this.state.fullRoundHistory.slice(0, MAX_DISPLAYED_ROUNDS)] });
    };

    componentDidMount() {
        super.componentDidMount?.();
        animationStateTransmitter.onAnimationComplete(this.handleAnimationComplete);
    }

    componentWillUnmount() {
        super.componentWillUnmount?.();
        animationStateTransmitter.removeAnimationCompleteListener(this.handleAnimationComplete);
    }

    componentDidUpdate(prevProps: Readonly<IColorGameRoundHistoryProps>, prevState: Readonly<IColorGameRoundHistoryState>, snapshot?: any): void {
        if (this.state.roundState !== prevState.roundState) {
            const hasBlink = this.state.roundState === ROUND_STATE.LOCKING_BET || this.state.roundState === ROUND_STATE.SHOW_ANIMATION_RESULT;
            this.setState({ hasBlink });

            if (hasBlink && this.state.rounds.findIndex(round => round.roundId === blinkDefaultRoundItem.roundId) === -1) {
                this.setState({ rounds: [blinkDefaultRoundItem, ...this.state.fullRoundHistory.slice(0, MAX_DISPLAYED_ROUNDS)] });
            }
        }

        // if (this.state.isAnimationComplete && this.state.isAnimationComplete !== prevState.isAnimationComplete) {
        //     this.setState({ rounds: [emptyDefaultRoundItem, ...this.state.fullRoundHistory.slice(0, MAX_DISPLAYED_ROUNDS)] });
        // }
    }

    render(): React.ReactElement {
        const { rounds, isFinishedShowResult, hasBlink } = this.state;
        if (!rounds || rounds.length === 0) {
            return <React.Fragment />;
        }

        const t = (key: string) => gc.Translator.translate(key, { languageId: gc.Translator.getCurrentLanguageId() });

        return (
            <div className={styles["round-history"]}>
                <div className={styles["hstack-round"]}>
                    {t('Common.previous_round')}:
                    {rounds.toReversed().map((roundHistory, index) => (
                        roundHistory.roundId === blinkDefaultRoundItem.roundId ?
                            <EmptyDiceRow
                                key={MAX_DISPLAYED_ROUNDS}
                                isFinishedShowResult={isFinishedShowResult}
                                blinking={hasBlink}
                            />
                            :
                            <ColorGameRoundHistoryItem
                                key={roundHistory.roundId}
                                roundHistory={roundHistory}
                                showArrow={index < MAX_DISPLAYED_ROUNDS}
                            />
                    ))}
                    {/* {showEmptyDiceRow && <EmptyDiceRow isFinishedShowResult={isFinishedShowResult} blinking={hasBlink} />} */}
                </div>
            </div>
        );
    }
}