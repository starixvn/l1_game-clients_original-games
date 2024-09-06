import * as gc from "@sg/sg-game-client";
import { Rounds, Settlements } from "@sg/sg-game-client";
import { ROUND_STATE } from "@sg/sg-game-client/dist/game/rounds/round-time-store";
import { handle, render } from "@sg/sg-observer";
import React from "react";
import { PlayerContext } from "../../react-contexts/auth";
import { GameContextProvider } from "../../react-contexts/game-context/game-context";
import { FunctionUtils } from "../../utils/funtion-utils";
import { ConfirmBet } from "../bet-option/confirm-bet";
import GameContainer from "../game-container";
import Notice from "../notices/notice";
import Warning from "../notices/warning";
import Styles from "./game-base.module.scss";
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
        this.closeConnect();
    }

    closeConnect() {}

    onVisibilityChange = () => {};

    onStart() {
        this.connectToService();
        this.initUserSettings();
        this.initPlayerSelections();
    }

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler)
    connectToService() {}

    @render(gc.JoinGame.JoinGameStore, (store) => store.toGame, { fireImmediately: false })
    requestOpenGame() {
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
    inGame() {
        return this.props.namespace;
    }

    @render(gc.Rounds.RoundStore, (store) => ({ minBet: store.minBet, maxBet: store.maxBet }))
    renderMinMaxBet({ minBet, maxBet }: { minBet: number; maxBet: number }) {}

    renderNotice(): JSX.Element {
        return <Notice namespace={this.props.namespace}></Notice>;
    }

    renderWarning(): JSX.Element {
        return <Warning namespace={this.props.namespace}></Warning>;
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

    renderStatistic() {
        return <></>;
    }

    @render(Settlements.SettlementStore, (store) => store.currentFinish, {
        fireImmediately: false,
    })
    renderCurrentFinish(currentFinish: gc.GameServiceMessage.Finish) {
        if (!currentFinish) {
            return;
        }
        const { result, settlementResult } = currentFinish;

        if (!this.isValidResult(result, settlementResult)) {
            return;
        }

        this.showResult(true, result, settlementResult).then(() => {
            this.finishShowResult();
        });
    }

    async showResult(
        hasAnimation: boolean,
        result?: gc.GameServiceMessage.TResult,
        settlementResult?: gc.GameServiceMessage.TSettlementResult
    ) {
        //implement animation
        await FunctionUtils.delay(1000);
    }

    isValidResult(result?: gc.GameServiceMessage.TResult, settlementResult?: gc.GameServiceMessage.TSettlementResult) {
        return !!result && !!settlementResult;
    }

    @render(Rounds.RoundTimeStore, (store) => store.roundState)
    handleRoundState(roundState: string) {
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
                <div className={Styles["block-wrapper"]}>
                    <div className={Styles["info"]}>
                        {this.renderRoundIdSection()}
                        {this.renderCountDownTimer()}
                    </div>
                    <div className={Styles["result"]}>{this.renderResultBlock()}</div>
                    <div className={Styles["bet-options"]}>
                        {this.renderBettingBlock()}
                        <ConfirmBet namespace={this.props.namespace} />
                    </div>
                </div>

                {this.renderStatistic()}
                {this.renderNotice()}
                {this.renderWarning()}
            </>
        );
    }

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
