import * as gc from "@sg/sg-game-client";
import * as Observer from "observer";
import { Component } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import LiveGame from "../live-game/live-game";
import { ILobbyProps, ILobbyStates } from "./type";

@Observer.observer("default")
class Lobby extends Component<ILobbyProps, ILobbyStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            isAuthorized: false,
            namespace: "",
            system: 0,
        };
    }

    componentDidMount() {
        this.sso();
    }

    @Observer.handle(gc.Auth.AuthHandlers.SSO)
    sso() {
        return new URLSearchParams(window.location.search);
    }

    // @render(gc.Auth.AuthStore, (store) => ({
    //     isAuthorized: store.isAuthorized,
    //     system: store.system,
    // }))
    // openGame({ isAuthorized, system }: gc.Auth.AuthStore) {
    //     if (isAuthorized) {
    //         this.setState({ isAuthorized: true, system });
    //         this.loadChipSetting();
    //         this.triggerRecheckIn();
    //     }
    // }

    // @handle(gc.ChipSetting.ChipSettingHandler)
    // loadChipSetting() {}

    // @handle(gc.Auth.AuthHandlers.TriggerRecheckIn)
    // triggerRecheckIn() {}

    render() {
        const { isAuthorized } = this.state;
        console.log("lobby props", this.props);
        return (
            <div>
                <Tabs defaultActiveKey="sedie" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="sedie" title="Sedie" unmountOnExit={true}>
                        <LiveGame gameId={2} /> <br />
                        {isAuthorized && "Sedie Game"}
                    </Tab>
                    <Tab eventKey="bigsmall" title="Big Small" unmountOnExit={true}>
                        <LiveGame gameId={1} /> <br />
                        {isAuthorized && " Big Small Game"}
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default Lobby;
