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

export interface IOfferGame {
    gameId: number;
    minBet: number;
    maxBet: number;
    maxBetPerChoices: object;
}

@observer
class Lobby extends React.PureComponent<ILobbyProps, ILobbyState> {
    private reRenderGameTimeout?: NodeJS.Timeout;

    constructor(props: ILobbyProps) {
        configSharedContainer();
        super(props);
        this.state = {
            isViewOnly: false,
            offerGames: [],
            isRenderGame: true,
            expandedGames: {},
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
        if (!isAuthorized) {
            this.clearQueryParams();
            this.setState({ isViewOnly: true });
            this.connectLiveGateway();
        }
    }

    @handle(gc.GatewayConnection.GatewayConnectionHandlers.ConnectHandler)
    connectLiveGateway() {
    }

    @render(gc.Player.MainPlayerStore, (store) => store.offerGames)
    handleOfferGames(offerGames: IOfferGame[]) {
        if (offerGames?.length > 0) {
            const filteredOfferGames = lobbyUtils.getFilteredGames(offerGames);
            // Initialize all games as expanded
            const expandedGames = filteredOfferGames.reduce((acc, game) => {
                acc[game.gameId] = true;
                return acc;
            }, {} as { [key: number]: boolean });

            this.setState({
                offerGames: filteredOfferGames,
                expandedGames
            } as ILobbyState);
        }
    }

    getGames() {
        const { offerGames, isRenderGame, expandedGames } = this.state;
        const { router } = this.props;

        return offerGames.map((filterGame) => {
            return lobbyUtils.getGameTabById(
                filterGame.gameId,
                router,
                isRenderGame
            );
        });
    }

    @render(LobbyStore, (store) => store.tryToConnectCount)
    updateTryToConnectCount(tryToConnectCount: number) {
        const isDisconnect = tryToConnectCount > 0;
        if (isDisconnect) {
            this.setState({ isRenderGame: false });
            this.reRenderGameTimeout = setTimeout(() => {
                this.setState({ isRenderGame: true });
            }, 500);
        }
    }

    renderGames() {
        const { offerGames } = this.state;
        if (offerGames.length === 0) {
            return <></>;
        }

        return (
            <Tabs defaultActiveKey={offerGames[0].gameId} className={styles["lobby-tabs"]}>
                {this.getGames()}
            </Tabs>
        );
    }

    render() {
        const { isViewOnly } = this.state;
        return <div className={styles["lobby"]}>{isViewOnly && this.renderGames()}</div>;
    }
}

export default withRouter(Lobby);
