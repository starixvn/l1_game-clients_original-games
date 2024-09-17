import { TURN_ROUND_STATE, RoundStore, RoundTimeStore } from "@sg/sg-game-client/dist/game-turn-base/rounds";
import { render } from "@sg/sg-observer";
import Styles from "../game-base/game-base.module.scss";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../observer-component/observer-component";

export interface ITurnCounterState extends IStateObserver {
    turnCounter: number;
    roundState: string
}

export default class TurnCounter extends ObserverComponent<IPropsObserver, ITurnCounterState> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
            turnCounter: 0,
            roundState: TURN_ROUND_STATE.NONE
        };
    }

    @render(RoundStore, (store) => store.turnCounter)
    renderTurnCounter(turnCounter: number) {
        this.setState({ turnCounter });
    }


    @render(RoundTimeStore, (store) => store.roundState)
    renderRoundState(roundState: string) {
        this.setState({ roundState });
    }

    render() {
        const { turnCounter, roundState } = this.state;
        if (turnCounter <= 0) {
            return <></>;
        }

        return <div className={Styles["turn-counter"]}> Draw_{turnCounter}: {roundState}</div>;
    }
}
