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
import { GameBaseProps } from "./type";

export interface IGameBaseState {
    isConnected: boolean;
    initialized: boolean;
    disabled: boolean;
    isOpenStatistic: boolean;
}

abstract class GameBase<P extends GameBaseProps, S extends IGameBaseState> extends React.PureComponent<P, S> {
    constructor(props: P) {
        super(props);
        this.state = { isConnected: false, isOpenStatistic: false } as S;
        this.toggleStatistic = this.toggleStatistic.bind(this);
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

    renderRoundHistory() {
        return <></>;
    }

    renderStatistic() {
        return <>Statistic</>;
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

    @handle(Lobby.LobbyHandlers.TryToConnectHandler)
    tryToConnectHandler() {}

    @render(gc.Connection.ConnectionStore, (store) => store.isConnected)
    handleDisconnected(isConnected: boolean) {
        if (isConnected === null) {
            return;
        }
        this.setState({ isConnected });
    }

    @render(gc.GameConfigs.GameConfigStore, (store) => store.initialized)
    handleGameConfigInitialized(initialized: boolean) {
        this.setState({ initialized } as IGameBaseState);
    }

    @render(gc.DisabledGame.DisabledGameStore, (store) => store.disabled)
    handleDisabledGame(disabled: boolean) {
        this.setState({ disabled } as IGameBaseState);
    }

    toggleStatistic() {
        this.setState({ isOpenStatistic: !this.state.isOpenStatistic });
    }

    getRenderTemplate() {
        const { isConnected, initialized: isGameConfigInitialized, disabled } = this.state;
        const isFirstInit = !isGameConfigInitialized && !disabled;
        if (isFirstInit || disabled) {
            return disabled ? this.renderNotice() : this.renderLoading();
        }

        const renderArrow = (isOpenStatistic: boolean) => {
            return (
                <i className={`${Styles["arrow-icon"]}`}>
                    <svg
                        className={`${Styles["svg-icon"]}`}
                        width="24"
                        height="24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="#78acff"
                    >
                        <path d={isOpenStatistic ? "M18 9l-6 6-6-6" : "M6 15l6-6 6 6"} />
                    </svg>
                </i>
            );
        };

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

                <div className={Styles["history-block"]}>
                    <div className={Styles["previous-round"]}>{this.renderRoundHistory()}</div>
                    <div className={Styles["statistic-button"]} onClick={this.toggleStatistic}>
                        <span>Statistic</span>
                        {renderArrow(this.state.isOpenStatistic)}
                    </div>
                </div>
                {this.state.isOpenStatistic && this.renderStatistic()}

                {this.renderNotice()}
                {this.renderWarning()}
            </>
        );
    }

    private renderLoading() {
        return (
            <Container className="col-md-1 mx-auto mt-5">
                <Loading />
            </Container>
        );
    }

    private renderDisconnect() {
        return (
            <>
                <p>Connection fail</p>
                <Button
                    variant="success"
                    onClick={() => {
                        this.tryToConnectHandler();
                    }}
                >
                    Reconnect
                </Button>
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
