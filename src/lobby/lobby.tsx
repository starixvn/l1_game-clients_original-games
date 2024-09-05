import * as gc from "@sg/sg-game-client";
import { handle, observer, render } from "@sg/sg-observer";
import { withRouter } from "next/router";
import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { settingsBigSmall } from "../games/big-small/game-settings";
import BigSmall from "../games/big-small/page";
import { settingsSeDie } from "../games/sedie/game-settings";
import SeDie from "../games/sedie/page";
import styles from "./lobby.module.scss";
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
        this.sso();
    }

    @handle(gc.Auth.AuthHandlers.SSO)
    sso() {
        return new URLSearchParams(window?.location?.search);
    }

    @render(gc.Auth.AuthStore, (store) => store.isAuthorized)
    openGame(isAuthorized: boolean) {
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

        return (
            <div className={styles["lobby"]}>
                {isAuthorized && (
                    <Tabs defaultActiveKey="sedie" className={styles["lobby-tabs"]}>
                        <Tab eventKey="sedie" title={gc.Translator.t("SeDie.game_name")} unmountOnExit={true}>
                            <div className={styles["game-title"]}>
                                <div>Sedie</div>
                                <div className={styles["text-center"]}>Odd/Even</div>
                                <div className={styles["text-center"]}>Red/White</div>
                            </div>
                            <div className={styles["game-lobby"]}>
                                <SeDie {...this.props} namespace={settingsSeDie.mainObserverNamespace} />
                            </div>
                        </Tab>
                        <Tab eventKey="bigsmall" title={gc.Translator.t("BigSmall.game_name")} unmountOnExit={true}>
                            <BigSmall {...this.props} namespace={settingsBigSmall.mainObserverNamespace} />
                        </Tab>
                    </Tabs>
                )}
            </div>
        );
    }
}

export default withRouter(Lobby);
