import * as gc from "@sg/sg-game-client";
import { handle, observer, render } from "@sg/sg-observer";
import { withRouter, NextRouter } from "next/router";
import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { configSharedContainer } from "../_shared/components/game-base/startup";
import { settingsBigSmall } from "../games/big-small/game-settings";
import BigSmall from "../games/big-small/page";
import { settingsSeDie } from "../games/sedie/game-settings";
import SeDie from "../games/sedie/page";
import styles from "./lobby.module.scss";
import type { ILobbyProps, ILobbyState } from "./type";
import { getGameSettingIds, getGameSetting } from "../_shared/app-settings";
import SeDieHeader from "../games/sedie/header";
import BigSmallHeader from "../games/big-small/header";
import { utils } from "@sg/sg-game-client/dist/shared";
import * as lobbyUtils from "../lobby/utils";
configSharedContainer();

@observer
class Lobby extends React.PureComponent<ILobbyProps, ILobbyState> {
    constructor(props: ILobbyProps) {
        super(props);
        this.state = {
            isAuthorized: false,
            offerGames: [],
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

        return filteredGames.map((gameId) => {
            return this.getGameById(gameId);
        });
    }

    getGameById(gameId: number) {
        const gameSetting = getGameSetting(gameId);

        const gameName = gc.Translator.t(`${gameSetting.gameName}.game_name`);
        const key = gameSetting.mainObserverNamespace;
        return (
            <Tab key={key} eventKey={key} title={gameName} unmountOnExit={true}>
                {lobbyUtils.getGameHeaderById(gameId)}
                <div className={styles["game-lobby"]}>{lobbyUtils.getGameById(gameId, this.props.router)}</div>
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
