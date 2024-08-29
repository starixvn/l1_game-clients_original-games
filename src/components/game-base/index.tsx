import * as gc from "@sg/sg-game-client";
import { Rounds, Settlements } from "@sg/sg-game-client";
import { ROUND_STATE } from "@sg/sg-game-client/dist/game/rounds/round-time-store";
import { handle, render } from "observer";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { PlayerContext } from "../../_shared/react-contexts/auth";
import { GameContextProvider } from "../../_shared/react-contexts/game-context/game-context";
import GameContainer from "../game-components";
import { GameBaseProps } from "./type";
export interface IGameBaseState {
    isReceiveFinishBeforeRoundHistory: boolean;
    isConnected: boolean;
    isRenderResultBlock: boolean;
}

abstract class GameBase<P extends GameBaseProps, S extends IGameBaseState> extends React.PureComponent<P, S> {
    constructor(props: P) {
        super(props);
        this.state = {
            isReceiveFinishBeforeRoundHistory: true,
            isConnected: false,
            isRenderResultBlock: false,
        } as S;
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

    @render(Settlements.SettlementStore, (store) => ({ result: store.result, settlementResult: store.settlementResult }))
    handleResult(data: { result: gc.GameServiceMessage.TResult; settlementResult: gc.GameServiceMessage.TSettlementResult }) {
        console.log("receive result from ws");
    }

    @render(Rounds.RoundTimeStore, (store) => store.roundState)
    handleRoundState(roundState: string) {
        if (roundState === ROUND_STATE.SHOW_RESULT) {
            this.finishShowResult();
        }
        if (roundState !== ROUND_STATE.SHOW_RESULT) {
            this.setState({ isRenderResultBlock: false });
        }
    }

    @handle(Settlements.SettlementUIHandlers.FinishedShowResult)
    finishShowResult() {
        //show result
        this.setState({ isRenderResultBlock: true });
    }

    getRenderTemplate() {
        const { isRenderResultBlock } = this.state;

        return (
            <>
                <Row>
                    {this.renderRoundIdSection()}
                    <Col>
                        <Row>
                            <Col>{this.renderCountDownTimer()}</Col>
                            <Col>{isRenderResultBlock && this.renderResultBlock()}</Col>
                        </Row>
                    </Col>
                </Row>

                {this.renderBettingBlock()}
                {this.renderStatistic()}
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
