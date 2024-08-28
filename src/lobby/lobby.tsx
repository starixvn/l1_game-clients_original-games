import * as gc from "@sg/sg-game-client";
import { withRouter } from "next/router";
import { handle, observer, render } from "observer";
import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TimeOutContainer from "../components/game-components/timeout";
import SeDie from "../games/sedie/page";
import LiveGame from "../live-game/live-game";
import { ILobbyProps, ILobbyStates } from "./type";

@observer
class Lobby extends React.PureComponent<ILobbyProps, ILobbyStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            isAuthorized: false,
            namespace: "",
            system: 0,
        };
    }

    componentDidMount() {
        const { isAuthorized } = this.state;
        console.log("sso--------");
        this.sso();
    }

    @handle(gc.Auth.AuthHandlers.SSO)
    sso() {
        return new URLSearchParams(window?.location?.search);
    }

    @render(gc.Auth.AuthStore, (store) => store.isAuthorized)
    openGame(isAuthorized: boolean) {
        console.log("openGame----------------", isAuthorized);
        if (isAuthorized) {
            this.setState({ isAuthorized: true });
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
        console.log("isAuthorized", isAuthorized);
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
                <TimeOutContainer />
            </div>
        );
    }
}

export default withRouter(Lobby);
