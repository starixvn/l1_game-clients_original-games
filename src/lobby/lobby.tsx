import * as gc from "@sg/sg-game-client";
import { handle, observer, render } from "@sg/sg-observer";
import { withRouter } from "next/router";
import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { getGameSetting } from "../_shared/app-settings";
import { configSharedContainer } from "../_shared/components/game-base/startup";
import { LobbyStore } from "../_shared/states/lobby";
import { settingsSeDie } from "../games/sedie/game-settings";
import * as lobbyUtils from "../lobby/utils";
import styles from "./lobby.module.scss";
import type { ILobbyProps, ILobbyState } from "./type";

@observer
class Lobby extends React.PureComponent<ILobbyProps, ILobbyState> {
    constructor(props: ILobbyProps) {
        configSharedContainer();
        super(props);
        this.state = {
            isAuthorized: false,
            offerGames: [],
            connectedCount: 0,
        } as ILobbyState;
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
        const { offerGames } = this.state;

        const filteredGames = lobbyUtils.getFilteredGames(offerGames);

        return filteredGames.map((gameId) => this.getGameTabById(gameId));
    }

    @render(LobbyStore, (store) => store.connectedCount)
    updateConnectedCount(connectedCount: number) {
        this.setState({ connectedCount });
    }

    renderGame(gameId: number) {
        const { router } = this.props;

        return (
            <>
                {lobbyUtils.getGameHeaderById(gameId)}
                <div className={styles["game-lobby"]}>{lobbyUtils.getGameById(gameId, router)}</div>
            </>
        );
    }

    getGameTabById(gameId: number) {
        const gameSetting = getGameSetting(gameId);

        const gameName = gc.Translator.t(`${gameSetting.gameName}.game_name`);
        const key = gameSetting.mainObserverNamespace;
        return (
            <Tab key={key} eventKey={key} title={gameName} unmountOnExit={true}>
                {this.renderGame(gameId)}
            </Tab>
        );
    }

    renderGames() {
        const { offerGames } = this.state;
        if (offerGames.length === 0) {
            return <>No games offer</>;
        }
        return (
            <Tabs defaultActiveKey={settingsSeDie.mainObserverNamespace} className={styles["lobby-tabs"]}>
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
