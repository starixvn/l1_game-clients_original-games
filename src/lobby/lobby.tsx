import * as gc from "@sg/sg-game-client";
import { withRouter } from "next/router";
import { handle, observer, render } from "observer";
import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TimeOutContainer from "../components/game-components/timeout";
import SeDie from "../games/sedie/page";
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
        console.log("sso--------");
        this.sso();
    }

    @handle(gc.Auth.AuthHandlers.SSO)
    sso() {
        return new URLSearchParams(window?.location?.search);
    }

    @render(gc.Auth.AuthStore, (store) => store.isAuthorized)
    openGame(isAuthorized: boolean) {
        if (isAuthorized) {
            console.log("isAuthorized----------------", isAuthorized);
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
        return (
            <div>
                <Tabs defaultActiveKey="sedie" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="sedie" title={gc.Translator.t("SeDie.game_name")} unmountOnExit={true}>
                        {isAuthorized && <SeDie {...this.props} />}
                    </Tab>
                    <Tab eventKey="bigsmall" title={gc.Translator.t("BigSmall.game_name")} unmountOnExit={true}>
                        {isAuthorized && " Big Small Game"}
                    </Tab>
                </Tabs>
                <div>{gc.Translator.t("Common.one_choice_allowed")}</div>
                <TimeOutContainer />
            </div>
        );
    }
}

export default withRouter(Lobby);
