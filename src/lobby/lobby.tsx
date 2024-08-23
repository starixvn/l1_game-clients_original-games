import * as gc from "@sg/sg-game-client";
import dynamic from "next/dynamic";
import { handle, observer, render } from "observer";
import { Component } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import LiveGame from "../live-game/live-game";
import { ILobbyProps, ILobbyStates } from "./type";

const SeDie = dynamic(() => import("../games/sedie/page"));

@observer
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

    @handle(gc.Auth.AuthHandlers.SSO)
    sso() {
        console.log("new URLSearchParams(window.location.search)", new URLSearchParams(globalThis.location.search));
        return new URLSearchParams(globalThis.location.search);
    }

    @render(gc.Auth.AuthStore, (store) => ({
        isAuthorized: store.isAuthorized,
        system: store.system,
    }))
    openGame({ isAuthorized, system }: gc.Auth.AuthStore) {
        if (isAuthorized) {
            this.setState({ isAuthorized: true, system });
            this.loadChipSetting();
            this.triggerRecheckIn();
        }
    }

    @handle(gc.ChipSetting.ChipSettingHandler)
    loadChipSetting() {}

    @handle(gc.Auth.AuthHandlers.TriggerRecheckIn)
    triggerRecheckIn() {}

    render() {
        const { isAuthorized } = this.state;
        return (
            <div>
                <Tabs defaultActiveKey="sedie" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="sedie" title="Sedie" unmountOnExit={true}>
                        <LiveGame gameId={2} /> <br />
                        {isAuthorized && <SeDie />}
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
