import * as gc from '@sg/sg-game-client';
import { Settlements } from '@sg/sg-game-client';
import { handle, render } from '@sg/sg-observer';
import React from 'react';
// import { Button, Container } from 'react-bootstrap';
import { GameContextProvider } from '../../react-contexts/game-context/game-context';
import { Lobby } from '../../states';
import AnimationBalance from '../anim-balance';
import { ConfirmBet } from '../bet-option/confirm-bet';
import GameContainer from '../game-container';
import Loading from '../loading';
import Notice from '../notices/notice';
import Warning from '../notices/warning';
import StatisticButton from '../statistic-button/statistic-button';
import Styles from './game-base.module.scss';
import { GameBaseProps } from './type';

export interface IGameBaseState {
    isConnected: boolean;
    isConnectFailed: boolean;
    initialized: boolean;
    showDisabledPopup: boolean;
    isOpenStatistic: boolean;
    statusSettlement?: gc.GameServiceMessage.Status;
    roundState: string;
    isFinishShowResult: boolean;
    gameId: number;
}
interface GameStyleOverrides {
    [key: string]: string;
}

abstract class GameBase<P extends GameBaseProps, S extends IGameBaseState> extends React.PureComponent<P, S> {
    protected overrideClasses?: GameStyleOverrides;

    constructor(props: P) {
        super(props);
        this.state = { isConnectFailed: false, isOpenStatistic: false, isFinishShowResult: false } as S;
        this.toggleStatistic = this.toggleStatistic.bind(this);
    }

    componentDidMount() {
        document.addEventListener('visibilitychange', this.onVisibilityChange);
        this.connectToServiceGateway();
    }

    componentWillUnmount() {
        this.onDestroy();
        document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }

    onDestroy() {
        this.closeConnect();
    }

    abstract closeConnect(): void;

    abstract joinGame(): void;

    abstract connectLiveGateway(): void;

    onVisibilityChange = () => { };
    @handle(gc.GatewayConnection.GatewayConnectionHandlers.ConnectHandler, (handler) => handler.handle())
    connectToServiceGateway() { }

    @handle(gc.Connection.ConnectionHandlers.CloseConnectHandler, (handler) => handler.handle())
    terminateConnection() { }

    @render(gc.Connection.ConnectionStore, (store) => store.isSignedIn)
    handleConnected(isSignedIn: boolean) {
        isSignedIn && this.inGame();
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

    renderHeader() {
        return <></>;
    }

    @render(Settlements.SettlementStatusStore, (store) => store.settlementStatus, {
        fireImmediately: false,
    })
    assignStatus(settlementStatus: any) {
        this.setState({ statusSettlement: settlementStatus });
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
        this.setState({ isFinishShowResult: false });
        this.showResult(true, result, settlementResult).then(() => {
            this.finishShowResult();
        });
    }

    abstract showResult(
        hasAnimation: boolean,
        result?: gc.GameServiceMessage.TResult,
        settlementResult?: gc.GameServiceMessage.TSettlementResult,
    ): Promise<void>;

    isValidResult(result?: gc.GameServiceMessage.TResult, settlementResult?: gc.GameServiceMessage.TSettlementResult) {
        return !!result && !!settlementResult;
    }

    @handle(Settlements.SettlementUIHandlers.FinishedShowResult)
    finishShowResult() {
        this.setState({ isFinishShowResult: true });
    }

    @handle(Lobby.LobbyHandlers.TryToConnectHandler)
    tryToConnectHandler() { }

    @render(gc.Connection.ConnectionStore, (store) => store.isConnectFailed)
    handleConnectFail(isConnectFailed: boolean) {
        if (isConnectFailed === null) {
            return;
        }
        this.setState({ isConnectFailed: isConnectFailed });
    }

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

    @render(gc.DisabledGame.DisabledGameStore, (store) => store.showPopup)
    handleDisabledGame(showPopup: boolean) {
        this.setState({ showDisabledPopup: showPopup } as IGameBaseState);
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundState)
    renderCountDownTimerState(roundState: string) {
        this.setState({ roundState });
    }

    toggleStatistic() {
        this.setState({ isOpenStatistic: !this.state.isOpenStatistic });
    }

    getRenderTemplate() {
        const { isConnected, isConnectFailed, initialized: isGameConfigInitialized, showDisabledPopup, statusSettlement } = this.state;

        if (isConnectFailed) {
            return this.renderDisconnect();
        }

        const isFirstInit = !isGameConfigInitialized && !showDisabledPopup;
        if (isFirstInit || showDisabledPopup) {
            return showDisabledPopup ? this.renderNotice() : this.renderLoading();
        }

        return !isConnected ? (
            this.renderDisconnect()
        ) : (
            <>
                {this.renderHeader()}
                <div className={`${Styles['block-wrapper']} ${this.overrideClasses?.blockWrapper}`}>
                    <div className={`${Styles['info']} ${this.overrideClasses?.info}`}>
                        {this.renderRoundIdSection()}
                        {this.renderCountDownTimer()}
                    </div>
                    <div className={`${Styles['result']} ${this.overrideClasses?.result}`}>{this.renderResultBlock()}</div>
                    <div className={`${Styles['bet-options']} ${this.overrideClasses?.betOptions}`}>
                        {this.renderBettingBlock()}
                        <ConfirmBet namespace={this.props.namespace} />
                        <div className={`${Styles['animation-balance']} ${Styles[`game-${this.state.gameId}`]}`}>{this.renderAnimationBalance()}</div>
                    </div>
                </div>

                <div className={Styles['history-block']}>
                    <div className={Styles['previous-round']}>{this.renderRoundHistory()}</div>
                    <div className={Styles['statistic-btn']}>
                        <StatisticButton isOpenStatistic={this.state.isOpenStatistic} handleToggle={this.toggleStatistic} />
                    </div>
                </div>
                {this.state.isOpenStatistic && this.renderStatistic()}

                {this.renderNotice()}
                {this.renderWarning()}
            </>
        );
    }

    private renderAnimationBalance() {
        const { statusSettlement, isFinishShowResult } = this.state;
        if (!statusSettlement || !statusSettlement.win) {
            return <></>;
        }
        if (isFinishShowResult) {
            return <AnimationBalance winBet={statusSettlement?.bet} />;
        }
    }

    private renderLoading() {
        return (
            <div className="col-md-1 mx-auto mt-5">
                <Loading />
            </div>
        );
    }

    createConnection() {
        document.addEventListener('visibilitychange', this.onVisibilityChange);
        this.connectToServiceGateway();
        this.connectLiveGateway();
    }

    handleReconnect = () => {
        this.terminateConnection();
        this.createConnection();
        this.joinGame();
    };

    private renderDisconnect() {
        const reconnectText = gc.Translator.translate('Common.reconnect');
        return (
            <div className={`${Styles['block-wrapper']} ${this.props.overrideClasses}`}>
                <div className={Styles['reconnect-btn-container']}>
                    <p className={Styles['reconnect-text']}>{gc.Translator.t('Common.connect_failed')}</p>
                    <button
                        className={`${'c-btn'} ${'c-btn--bet'} ${Styles['reconnect-btn']}`}
                        data-disabled={false}
                        onClick={this.handleReconnect}
                    >
                        <span className="c-text">{reconnectText}</span>
                    </button>
                </div>
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
