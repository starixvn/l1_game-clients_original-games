import * as gc from "@sg/sg-game-client";
import { handle, observer, render } from "@sg/sg-observer";
import { withRouter } from "next/router";
import React from "react";
import { Tabs } from "react-bootstrap";
import appSettings, { getGameSetting } from "../_shared/app-settings";
import { configSharedContainer } from "../_shared/components/game-base/startup";
import { LobbyStore } from "../_shared/states/lobby";
import * as lobbyUtils from "../lobby/utils";
import styles from "./lobby.module.scss";
import type { ILobbyProps, ILobbyState } from "./type";

const setting = getGameSetting(appSettings.defaultGameId);

@observer
class Lobby extends React.PureComponent<ILobbyProps, ILobbyState> {
    private reRenderGameTimeout?: NodeJS.Timeout;

    constructor(props: ILobbyProps) {
        configSharedContainer();
        super(props);
        this.state = {
            isAuthorized: false,
            offerGames: [],
            connectedCount: 0,
            isRenderGame: true,
        } as ILobbyState;
    }
    clearReRenderGameTimeout = () => {
        if (!this.reRenderGameTimeout) {
            return;
        }
        clearTimeout(this.reRenderGameTimeout);
    };

    componentWillUnmount() {
        this.clearReRenderGameTimeout();
    }

    async componentDidMount() {
        const { router } = this.props;
        const token = (router.query?.token || "") as string;
        this.sso({ token });
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

    @render(gc.Player.MainPlayerStore, (store) => store.offerGames)
    handleOfferGames(
        offerGames: {
            gameId: number;
        }[]
    ) {
        if (offerGames?.length > 0) {
            this.setState({ offerGames } as ILobbyState);
        }
    }

    @handle(gc.Auth.AuthHandlers.TriggerRecheckIn)
    triggerRecheckIn() {}

    getGames() {
        const { offerGames, isRenderGame } = this.state;

        const filteredGames = lobbyUtils.getFilteredGames(offerGames);
        const { router } = this.props;

        return filteredGames.map((gameId) => lobbyUtils.getGameTabById(gameId, router, isRenderGame));
    }

    @render(LobbyStore, (store) => store.tryToConnectCount)
    updateConnectedCount(connectedCount: number) {
        const isDisconnect = connectedCount > 0;
        if (isDisconnect) {
            this.setState({ connectedCount, isRenderGame: false });
            this.reRenderGameTimeout = setTimeout(() => {
                this.setState({ isRenderGame: true });
            }, 500);
        }
    }

    renderGames() {
        const { offerGames } = this.state;
        if (offerGames.length === 0) {
            return <>No games offer</>;
        }
        return (
            <Tabs defaultActiveKey={setting.mainObserverNamespace} className={styles["lobby-tabs"]}>
                {this.getGames()}
            </Tabs>
        );
    }

    render() {
        const { isAuthorized } = this.state;
        return <div className={styles["lobby"]}>{isAuthorized && this.renderGames()}</div>;
    }
}

export default withRouter(Lobby);
