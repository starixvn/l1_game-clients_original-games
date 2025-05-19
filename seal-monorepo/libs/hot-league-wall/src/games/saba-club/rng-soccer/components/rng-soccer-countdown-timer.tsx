import React from 'react';
import * as gc from "@sg/sg-game-client";
import { ROUND_STATE } from "@sg/sg-game-client/dist/game/rounds";
import classnames from "classnames";
import CountDownTimer, { ICountDownTimerProps, ICountDownTimerState } from "../../../../_shared/components/count-down-timer";
import Styles from "../../../../_shared/components/game-base/game-base.module.scss";
import styles from "../rng-soccer.module.scss";
import Timer from "../../../../_shared/components/count-down-timer/timer";

export interface IRNGSoccerCountDownTimerProps extends ICountDownTimerProps {
    namespace: string;
    language: string;
}

export default class RNGSoccerCountDownTimer extends CountDownTimer {
    private getRNGSoccerTimerContentConfig(roundState: string) {
        const { PLACING_BET, LOCKING_BET, SHOW_ANIMATION_RESULT, SHOW_RESULT, STOP_GAME_LOOP } = ROUND_STATE;
        return {
            showTimer: [PLACING_BET].includes(roundState),
            showNoMoreBet: [LOCKING_BET].includes(roundState),
            showResult: [SHOW_ANIMATION_RESULT, STOP_GAME_LOOP, SHOW_RESULT].includes(roundState),
        };
    }

    render() {
        const { countdownTimer, roundState } = this.state;
        const isBettingRound = roundState === ROUND_STATE.PLACING_BET;

        if (roundState === ROUND_STATE.NONE || roundState === ROUND_STATE.STARTING_ROUND) {
            return <></>;
        }

        const config = this.getRNGSoccerTimerContentConfig(roundState);
        let content: string | number | null = null;
        if (config.showTimer) content = countdownTimer;
        else if (config.showNoMoreBet) content = gc.Translator.t('Common.message_stop_bet');
        else if (config.showResult) content = gc.Translator.t('Common.open_result');

        return (
            <div className={styles['timmer']}>
                <div className={Styles['count-down']}>
                    <div
                        className={classnames(Styles['timer-wrapper'], {
                            [Styles['placing-bet-state']]: roundState === ROUND_STATE.PLACING_BET,
                            [Styles['no-more-bet-state']]: roundState !== ROUND_STATE.PLACING_BET,
                        })}
                    >
                        {isBettingRound && (
                            <div className={Styles['timer-badge']}>
                                <Timer className={Styles.clock} />
                            </div>
                        )}
                        <div className={Styles['counting-text']}>
                            <span
                                className={classnames({
                                    [Styles['no-more-bet-state']]: !isBettingRound,
                                })}
                            >
                                {content}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
} 