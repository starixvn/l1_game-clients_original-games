import { RoundStore } from "@sg/sg-game-client/dist/game/rounds";
import { render } from "observer";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../_shared/commom-components/observer-component/observer-component";

export interface IRoundIdState extends IStateObserver {
    clientRoundId: number;
}

export default class RoundId extends ObserverComponent<IPropsObserver, IRoundIdState> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
            clientRoundId: 0,
        };
    }

    @render(RoundStore, (store) => store.clientRoundId)
    renderRoundId(clientRoundId: number) {
        this.setState({ clientRoundId });
        // console.log("clientRoundId: ", clientRoundId);
    }

    render() {
        const { clientRoundId } = this.state;
        // console.log("clientRoundId", clientRoundId);
        return <div className="round-id">Round: No. {clientRoundId}</div>;
    }
}
