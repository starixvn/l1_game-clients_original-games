import * as gc from "@sg/sg-game-client";
import { handle, observer, render } from "@sg/sg-observer";
import { withRouter } from "next/router";
import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { configSharedContainer } from "../_shared/components/game-base/startup";
import { settingsBigSmall } from "../games/big-small/game-settings";
import BigSmall from "../games/big-small/page";
import { settingsSeDie } from "../games/sedie/game-settings";
import SeDie from "../games/sedie/page";
import styles from "./lobby.module.scss";
import type { ILobbyProps, ILobbyStates } from "./type";

configSharedContainer();

@observer
class Lobby extends React.PureComponent<ILobbyProps, ILobbyStates> {
    constructor(props: ILobbyProps) {
        super(props);
        this.state = {
            isAuthorized: false,
        };
    }

    async componentDidMount() {
        const { router } = this.props;
        const token = (router.query?.token || "") as string;
        this.sso({ token, ref: "d_direct", appType: gc.AppTypes.Club });
    }

    @handle(gc.Auth.AuthHandlers.SSO)
    sso(ssoInfo: gc.Auth.ISSOInfo) {
        return ssoInfo;
    }

    protected clearQueryParams = () => {
        const { router } = this.props;
        router.replace(
            {
                pathname: router.pathname,
                query: {},
            },
            undefined,
            { shallow: true }
        );
    };

    @render(gc.Auth.AuthStore, (store) => store.isAuthorized)
    handleAuthorized(isAuthorized: boolean) {
        if (isAuthorized) {
            this.clearQueryParams();
            this.setState({ isAuthorized: true });
            this.triggerRecheckIn();
        }
    }

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
