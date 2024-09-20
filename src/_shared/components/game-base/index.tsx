import * as gc from "@sg/sg-game-client";
import { Settlements } from "@sg/sg-game-client";
import { handle, render } from "@sg/sg-observer";
import React from "react";
import { Button, Container } from "react-bootstrap";
import { GameContextProvider } from "../../react-contexts/game-context/game-context";
import { Lobby } from "../../states";
import { ConfirmBet } from "../bet-option/confirm-bet";
import GameContainer from "../game-container";
import Loading from "../loading";
import Notice from "../notices/notice";
import Warning from "../notices/warning";
import Styles from "./game-base.module.scss";
import { sharedContainer } from "./startup";
import { GameBaseProps } from "./type";

export interface IGameBaseState {
    isReConnecting: boolean;
    isConnected: boolean;
    initialized: boolean;
    disabled: boolean;
}

abstract class GameBase<P extends GameBaseProps, S extends IGameBaseState> extends React.PureComponent<P, S> {
    private isReConnectingTimeout?: NodeJS.Timeout;
    constructor(props: P) {
        super(props);
        this.state = { isReConnecting: false } as S;
    }

    clearReconnecting = () => {
        if (!this.isReConnectingTimeout) {
            return;
        }
        clearTimeout(this.isReConnectingTimeout);
        this.setState({ isReConnecting: false });
    };

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
        this.clearReconnecting();
    }

    abstract closeConnect(): void;

    onVisibilityChange = () => { };

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler)
    connectToService() { }

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

    abstract showResult(
        hasAnimation: boolean,
        result?: gc.GameServiceMessage.TResult,
        settlementResult?: gc.GameServiceMessage.TSettlementResult
    ): Promise<void>;

    isValidResult(result?: gc.GameServiceMessage.TResult, settlementResult?: gc.GameServiceMessage.TSettlementResult) {
        return !!result && !!settlementResult;
    }

    @handle(Settlements.SettlementUIHandlers.FinishedShowResult)
    finishShowResult() {
        //show result
    }

    @handle(Lobby.LobbyHandlers.IncreaseConnectedCountHandler)
    handleIncreaseConnectedCount() { }

    @render(gc.Connection.ConnectionStore, (store) => store.isConnected)
    handleDisconnected(isConnected: boolean) {
        this.setState({ isConnected });
        if (!isConnected) {
            return;
        }
        this.handleIncreaseConnectedCount();

        this.clearReconnecting();
    }

    @render(gc.GameConfigs.GameConfigStore, (store) => store.initialized)
    handleGameConfigInitialized(initialized: boolean) {
        this.setState({ initialized } as IGameBaseState);
    }

    @render(gc.DisabledGame.DisabledGameStore, (store) => store.disabled)
    handleDisabledGame(disabled: boolean) {
        this.setState({ disabled } as IGameBaseState);
    }

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler)
    handleReconnect() {
        this.setState({ isReConnecting: true });
        this.isReConnectingTimeout = setTimeout(() => {
            this.setState({ isReConnecting: false });
        }, 3000);
    }

    getRenderTemplate() {
        const { isConnected, initialized: isGameConfigInitialized, disabled } = this.state;
        const isFirstInit = !isGameConfigInitialized && !disabled;
        if (isFirstInit || disabled) {
            return (
                <>
                    {!disabled && this.renderLoading()}
                    {this.renderNotice()}
                </>
            );
        }

        return !isConnected ? (
            this.renderDisconnect()
        ) : (
            <>
                <div className={`${Styles["block-wrapper"]} ${this.props.overrideClasses}`}>
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

    private renderLoading() {
        return (
            <>
                <Container className="col-md-1 mx-auto mt-5">
                    <Loading />
                </Container>
            </>
        );
    }

    private renderDisconnect() {
        const { isReConnecting } = this.state;

        return (
            <div>
                <p>Connection fail</p>
                {!isReConnecting ? (
                    <Button
                        variant="success"
                        onClick={() => {
                            this.handleReconnect();
                        }}
                    >
                        Reconnect
                    </Button>
                ) : (
                    <Loading />
                )}
            </div>
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
