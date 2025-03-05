import * as gc from '@sg/sg-game-client';
import { ROUND_STATE, RoundTimeStore } from "@sg/sg-game-client/dist/game/rounds";
import { render } from "@sg/sg-observer";
import { Badge } from "react-bootstrap";
import Styles from "./big-small-count-down-timer.module.scss";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";

export interface IBigSmallCountDownTimerState extends IStateObserver {
    countdownTimer: number;
    roundState: string;
    isInRoundTime: boolean;
}

export default class BigSmallCountDownTimer extends ObserverComponent<IPropsObserver, IBigSmallCountDownTimerState> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = { dispose: null, countdownTimer: 0, roundState: ROUND_STATE.NONE, isInRoundTime: false };
    }

    @render(RoundTimeStore, (store) => store.countdownTimer)
    renderCountDownTimer(countdownTimer: number) {
        this.setState({ countdownTimer });
    }
    @render(RoundTimeStore, (store) => store.roundState)
    renderCountDownTimerState(roundState: string) {
        this.setState({ roundState });
    }

    private getTimerContentConfig(roundState: string) {
        const {
            START_GAME_LOOP,
            STARTING_ROUND,
            PLACING_BET,
            LOCKING_BET,
            SHOW_ANIMATION_RESULT,
            SHOW_RESULT,
            STOP_GAME_LOOP,
        } = ROUND_STATE;

        return {
            showTimer: [PLACING_BET].includes(roundState),
            showNoMoreBet: [LOCKING_BET].includes(roundState),
            showResult: [
                SHOW_ANIMATION_RESULT,
                STOP_GAME_LOOP,
                SHOW_RESULT,
                STARTING_ROUND,
                START_GAME_LOOP
            ].includes(roundState)
        };
    }


    private getTimerContent(countdownTimer: number, roundState: string) {
        const config = this.getTimerContentConfig(roundState);
        if (config.showNoMoreBet) return gc.Translator.t('Common.message_stop_bet');
        if (config.showResult) return gc.Translator.t('Common.open_result');

        return null;
    }

    render() {
        const { countdownTimer, roundState } = this.state;
        const isBettingRound = roundState === ROUND_STATE.PLACING_BET;

        return (
            <div className={Styles["count-down"]}>
                <div className={`${Styles["timer-wrapper"]} ${!isBettingRound && Styles["no-more-bet-state"]}`}>
                    {isBettingRound && (
                        <>
                            <Badge pill bg="success" className={Styles["timer-badge"]}>
                                <span className={Styles["timer"]}>
                                    <img src="/static/images/timer.svg" alt="timer" className={Styles["clock"]} />
                                </span>
                            </Badge>
                            <Badge pill bg="success" className={Styles["count-down-badge"]}>
                                <span>{countdownTimer}</span>
                            </Badge>
                        </>
                    )}
                    <div className={Styles['counting-text']}>
                        <span className={ !isBettingRound ? Styles['no-more-bet-state'] : ""}>
                            {this.getTimerContent(countdownTimer, roundState)}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}
