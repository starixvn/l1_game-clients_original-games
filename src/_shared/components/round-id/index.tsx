import { ROUND_STATE, RoundStore, RoundTimeStore } from "@sg/sg-game-client/dist/game/rounds";
import { render } from "@sg/sg-observer";
import Styles from "../game-base/game-base.module.scss";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../observer-component/observer-component";

export interface IRoundIdState extends IStateObserver {
    clientRoundId: number;
    roundState: string;
}

export default class RoundId extends ObserverComponent<IPropsObserver, IRoundIdState> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
            clientRoundId: 0,
            roundState: "",
        };
    }

    @render(RoundTimeStore, (store) => store.roundState)
    renderRoundState(roundState: string) {
        this.setState({ roundState });
    }

    @render(RoundStore, (store) => store.clientRoundId)
    renderRoundId(clientRoundId: number) {
        this.setState({ clientRoundId });
    }

    render() {
        const { clientRoundId, roundState } = this.state;
        if (roundState === ROUND_STATE.STOP_GAME_LOOP) return <></>;
        return <div className={Styles["round-id"]}> No. {clientRoundId}</div>;
    }
}
