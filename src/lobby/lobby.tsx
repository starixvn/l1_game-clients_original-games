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
        console.log("[Lobby] Initializing component");
        configSharedContainer();
        super(props);
        this.state = {
            isViewOnly: false,
            offerGames: [],
            isRenderGame: true,
        } as ILobbyState;
        console.log("[Lobby] Initial state:", this.state);
    }

    clearReRenderGameTimeout = () => {
        if (!this.reRenderGameTimeout) {
            console.log("[Lobby] No reRenderGameTimeout to clear");
            return;
        }
        console.log("[Lobby] Clearing reRenderGameTimeout");
        clearTimeout(this.reRenderGameTimeout);
    };

    componentWillUnmount() {
        console.log("[Lobby] Component unmounting");
        this.clearReRenderGameTimeout();
    }

    async componentDidMount() {
        console.log("[Lobby] Component mounted");
        const { router } = this.props;
        const token = (router.query?.token || "") as string;
        console.log("[Lobby] Initiating SSO with token:", token ? "Present" : "Not present");
        this.sso({ token });
    }

    @handle(gc.Auth.AuthHandlers.SSO)
    sso(ssoInfo: gc.Auth.ISSOInfo) {
        console.log("[Lobby] SSO handler called with token:", ssoInfo.token ? "Present" : "Not present");
        return ssoInfo;
    }

    protected clearQueryParams = () => {
        console.log("[Lobby] Clearing query parameters");
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
        console.log("[Lobby] Authorization status changed:", isAuthorized);
        if (!isAuthorized) {
            this.clearQueryParams();
            this.setState({ isViewOnly: true });
            console.log("[Lobby] Set to view-only mode, connecting to live gateway");
            this.connectLiveGateway();
        }
    }

    @handle(gc.GatewayConnection.GatewayConnectionHandlers.ConnectHandler)
    connectLiveGateway() {
        console.log("[Lobby] Connecting to live gateway");
    }

    @render(gc.Player.MainPlayerStore, (store) => store.offerGames)
    handleOfferGames(offerGames: IOfferGame[]) {
        console.log("[Lobby] Received offer games:", offerGames?.length || 0);
        if (offerGames?.length > 0) {
            const filteredOfferGames = lobbyUtils.getFilteredGames(offerGames);
            console.log("[Lobby] Filtered games count:", filteredOfferGames.length);
            this.setState({ offerGames: filteredOfferGames } as ILobbyState);
        }
    }

    getGames() {
        const { offerGames, isRenderGame } = this.state;
        const { router } = this.props;
        console.log("[Lobby] Getting games, count:", offerGames.length, "isRenderGame:", isRenderGame);

        return offerGames.map((filterGame) => {
            console.log("[Lobby] Creating game tab for gameId:", filterGame.gameId);
            return lobbyUtils.getGameTabById(filterGame.gameId, router, isRenderGame);
        });
    }

    @render(LobbyStore, (store) => store.tryToConnectCount)
    updateTryToConnectCount(tryToConnectCount: number) {
        console.log("[Lobby] Try to connect count updated:", tryToConnectCount);
        const isDisconnect = tryToConnectCount > 0;
        if (isDisconnect) {
            console.log("[Lobby] Disconnect detected, temporarily disabling game render");
            this.setState({ isRenderGame: false });
            this.reRenderGameTimeout = setTimeout(() => {
                console.log("[Lobby] Re-enabling game render after timeout");
                this.setState({ isRenderGame: true });
            }, 500);
        }
    }

    renderGames() {
        const { offerGames } = this.state;
        console.log("[Lobby] Rendering games, available games:", offerGames.length);
        if (offerGames.length === 0) {
            console.log("[Lobby] No games to render");
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
        console.log("[Lobby] Rendering component, isViewOnly:", isViewOnly);
        return <div className={styles["lobby"]}>{isViewOnly && this.renderGames()}</div>;
    }
}

export default withRouter(Lobby);
