import { ROUND_STATE, RoundTimeStore } from "@sg/sg-game-client/dist/game/rounds";
import { render } from "observer";
import {
    IPropsObserver,
    IStateObserver,
    ObserverComponent,
} from "../../_shared/commom-components/observer-component/observer-component";

export interface ICountDownTimerState extends IStateObserver {
    countdownTimer: number;
    roundState: string;
    isInRoundTime: boolean;
}

export default class CountDownTimer extends ObserverComponent<IPropsObserver, ICountDownTimerState> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = { countdownTimer: 0, roundState: ROUND_STATE.NONE, isInRoundTime: false } as ICountDownTimerState;
    }

    @render(RoundTimeStore, (store) => store.countdownTimer)
    renderCountDownTimer(countdownTimer: number) {
        this.setState({ countdownTimer } as ICountDownTimerState);
        // console.log("render countdownTimer: ", countdownTimer);
    }
    @render(RoundTimeStore, (store) => store.roundState)
    renderCountDownTimerState(roundState: string) {
        this.setState({ roundState } as ICountDownTimerState);
        // console.log("render state: ", roundState);
    }

    render() {
        const { countdownTimer, roundState, isInRoundTime } = this.state as ICountDownTimerState;
        // console.log("countdownTimer", countdownTimer);
        return (
            <div className="count-down">
                <p>Countdown: {countdownTimer}</p>

                <p>state: {roundState}</p>
            </div>
        );
    }
}
