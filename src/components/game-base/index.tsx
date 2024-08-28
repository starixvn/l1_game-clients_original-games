import * as gc from "@sg/sg-game-client";
import { handle, render } from "observer";
import React from "react";
import { Row } from "react-bootstrap";
import { PlayerContext } from "../../_shared/react-contexts/auth";
import { GameContextProvider } from "../../_shared/react-contexts/game-context/game-context";
import GameContainer from "../game-components";
import { GameBaseProps } from "./type";

abstract class GameBase<P extends GameBaseProps> extends React.PureComponent<P> {
    constructor(props: P) {
        super(props);
        this.state = {
            isReceiveFinishBeforeRoundHistory: true,
            isConnected: false,
        };
    }

    componentDidMount() {
        document.addEventListener("visibilitychange", this.onVisibilityChange);
        this.onStart();
    }

    componentWillUnmount() {
        this.onDestroy();
        document.removeEventListener("visibilitychange", this.onVisibilityChange);
    }

    onDestroy() {
        this.clearGameTimeoutAndInterval();
    }

    onVisibilityChange = () => {
        document.visibilityState === "hidden" ? this.onDestroy() : this.onStart();
    };

    clearGameTimeoutAndInterval = () => {};

    onStart() {
        this.connectToService();
        this.initUserSettings();
        this.initPlayerSelections();
    }

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler)
    connectToService() {}

    @render(gc.JoinGame.JoinGameStore, (store) => store.toGame, { fireImmediately: false })
    requestOpenGame() {
        console.log("toGame-----------");
        this.openGameCallback();
    }
    openGameCallback() {
        // handle
    }

    @handle(gc.UserSettings.UserSettingHandlers, (handle) => handle.loadStorages())
    initUserSettings() {}

    @handle(gc.PlayerSelections.PlayerSelectionHandlers.InitHandlers)
    initPlayerSelections() {}

    @render(gc.Connection.ConnectionStore, (store) => store.signedIn)
    onSignedIn(signedIn: boolean) {
        signedIn && this.inGame();
    }

    @render(gc.Connection.ConnectionStore, (store) => store.isConnected)
    onConnected(isConnected: boolean) {}

    @handle(gc.Connection.ConnectionHandlers.InGameHandler)
    inGame() {}

    @render(gc.Rounds.RoundStore, (store) => ({ minBet: store.minBet, maxBet: store.maxBet }))
    renderMinMaxBet({ minBet, maxBet }: { minBet: number; maxBet: number }) {}

    renderNotice() {
        return <></>;
    }

    renderRoundIdSection() {
        return <></>;
    }

    renderCountDownTimer() {
        return <></>;
    }

    renderBetHistoryModal() {
        return <></>;
    }

    renderGameGuideModal() {
        return <></>;
    }

    renderResultBlock() {
        return <></>;
    }

    renderBettingBlock() {
        return <></>;
    }

    renderScoreboards() {
        return <></>;
    }

    renderSlidingChips() {
        return <></>;
    }

    renderConfirmBet() {
        return <></>;
    }

    renderConfirmDialog() {
        return <></>;
    }

    renderStatistic() {
        return <></>;
    }

    renderStatisticContent() {
        return <></>;
    }

    getRenderTemplate() {
        return (
            <>
                <Row>
                    {this.renderRoundIdSection()}
                    {this.renderCountDownTimer()}
                </Row>

                {this.renderBettingBlock()}
            </>
        );
    }

    protected retryConnect() {}

    render() {
        return (
            <GameContainer>
                <GameContextProvider value={{ ...this.props }}>{this.getRenderTemplate()}</GameContextProvider>
            </GameContainer>
        );
    }
}

GameBase.contextType = PlayerContext;

export default GameBase;
