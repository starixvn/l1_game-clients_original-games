import { ROUND_STATE, RoundTimeStore } from "@sg/sg-game-client/dist/game/rounds";
import { render } from "@sg/sg-observer";
import { Badge } from "react-bootstrap";
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

    render() {
        const { countdownTimer, roundState, isInRoundTime } = this.state;

        return (
            <div className="count-down">
                <div>
                    Countdown: &nbsp;
                    <Badge pill bg={this.getColor(roundState)}>
                        {countdownTimer}
                    </Badge>
                </div>

                <div>state: {roundState}</div>
            </div>
        );
    }
}
