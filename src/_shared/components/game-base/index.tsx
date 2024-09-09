import * as gc from "@sg/sg-game-client";
import { Settlements } from "@sg/sg-game-client";
import { handle, render } from "@sg/sg-observer";
import React from "react";
import { GameContextProvider } from "../../react-contexts/game-context/game-context";
import { FunctionUtils } from "../../utils/funtion-utils";
import { ConfirmBet } from "../bet-option/confirm-bet";
import GameContainer from "../game-container";
import Notice from "../notices/notice";
import Warning from "../notices/warning";
import Styles from "./game-base.module.scss";
import { GameBaseProps } from "./type";

export interface IGameBaseState {}

abstract class GameBase<P extends GameBaseProps, S extends IGameBaseState> extends React.PureComponent<P, S> {
    constructor(props: P) {
        super(props);
        this.state = {} as S;
    }

    componentDidMount() {
        document.addEventListener("visibilitychange", this.onVisibilityChange);
        this.connectToService();
    }

    componentWillUnmount() {
        this.onDestroy();
        document.removeEventListener("visibilitychange", this.onVisibilityChange);
    }

    onDestroy() {
        this.closeConnect();
    }

    abstract closeConnect(): void;

    onVisibilityChange = () => {};

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler)
    connectToService() {}

    @render(gc.Connection.ConnectionStore, (store) => store.signedIn)
    handleSignedIn(signedIn: boolean) {
        signedIn && this.inGame();
    }

    @handle(gc.Connection.ConnectionHandlers.InGameHandler)
    inGame() {
        return this.props.namespace;
    }

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

    renderResultBlock() {
        return <></>;
    }

    renderBettingBlock() {
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

    @handle(Settlements.SettlementUIHandlers.FinishedShowResult)
    finishShowResult() {
        //show result
    }

    getRenderTemplate() {
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

export default GameBase;
