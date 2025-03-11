import { ROUND_STATE, RoundTimeStore } from "@sg/sg-game-client/dist/game/rounds";
import { render } from "@sg/sg-observer";
import { Badge } from "react-bootstrap";
import Styles from "../game-base/game-base.module.scss";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../observer-component/observer-component";

export interface ICountDownTimerState extends IStateObserver {
    countdownTimer: number;
    roundState: string;
    isInRoundTime: boolean;
}

export default class CountDownTimer extends ObserverComponent<IPropsObserver, ICountDownTimerState> {
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

    getColor(roundState: string) {
        const color: any = {
            placingBet: "success",
            lockingBet: "danger",
        };
        return color[roundState] ? color[roundState] : "primary";
    }

    getTimerColor(roundState: string) {
        const color: any = {
            [ROUND_STATE.PLACING_BET]: "timer-success",
            [ROUND_STATE.LOCKING_BET]: "timer-danger",
        };
        return color[roundState] ? color[roundState] : "timer-primary";
    }

    render() {
        const { countdownTimer, roundState, isInRoundTime } = this.state;
        const timer = roundState == ROUND_STATE.PLACING_BET || roundState == ROUND_STATE.LOCKING_BET ? `${countdownTimer}` : `...`;

        return (
            <div className={Styles["count-down"]}>
                <div className={Styles["timer-wrapper"]}>
                    <Badge pill bg={this.getColor(roundState)} className={Styles["timer-badge"]}>
                        <span className={Styles["timer"]}>
                            <img src="/static/images/timer.svg" alt="timer" className={Styles["clock"]} />
                        </span>
                    </Badge>
                    <Badge pill bg={this.getColor(roundState)} className={Styles["count-down-badge"]}>
                        <span>{timer}</span>
                    </Badge>
                </div>

                {/* <div>state: {roundState}</div> */}
            </div>
        );
    }
}
