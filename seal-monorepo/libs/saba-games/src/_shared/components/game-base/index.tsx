import * as gc from '@sg/sg-game-client';
import { Settlements } from '@sg/sg-game-client';
import { handle, render } from '@sg/sg-observer';
import React from 'react';
// import { Button, Container } from 'react-bootstrap';
import { GameContextProvider } from '../../react-contexts/game-context/game-context';
import { Lobby } from '../../states';
import { ConfirmBet } from '../bet-option/confirm-bet';
import GameContainer from '../game-container';
import Loading from '../loading';
import Notice from '../notices/notice';
import Warning from '../notices/warning';
import Styles from './game-base.module.scss';
import { GameBaseProps } from './type';
import StatisticButton from '../statistic-button/statistic-button';

export interface IGameBaseState {
    isConnected: boolean;
    isConnectFailed: boolean;
    initialized: boolean;
    showDisabledPopup: boolean;
    isOpenStatistic: boolean;
}

abstract class GameBase<P extends GameBaseProps, S extends IGameBaseState> extends React.PureComponent<P, S> {
    constructor(props: P) {
        super(props);
        this.state = { isConnectFailed: false, isOpenStatistic: false } as S;
        this.toggleStatistic = this.toggleStatistic.bind(this);
    }

    componentDidMount() {
        document.addEventListener('visibilitychange', this.onVisibilityChange);
        this.connectToService();
    }

    componentWillUnmount() {
        this.onDestroy();
        document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }

    onDestroy() {
        this.closeConnect();
    }

    abstract closeConnect(): void;

    onVisibilityChange = () => {};

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler)
    connectToService() {}

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
        settlementResult?: gc.GameServiceMessage.TSettlementResult,
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

    toggleStatistic() {
        this.setState({ isOpenStatistic: !this.state.isOpenStatistic });
    }

    getRenderTemplate() {
        const { isConnected, isConnectFailed, initialized: isGameConfigInitialized, showDisabledPopup } = this.state;

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
                <div className={`${Styles['block-wrapper']} ${this.props.overrideClasses}`}>
                    <div className={Styles['info']}>
                        {this.renderRoundIdSection()}
                        {this.renderCountDownTimer()}
                    </div>
                    <div className={Styles['result']}>{this.renderResultBlock()}</div>
                    <div className={Styles['bet-options']}>
                        {this.renderBettingBlock()}
                        <ConfirmBet
                            namespace={this.props.namespace} 
                        />
                    </div>
                </div>

                <div className={Styles["history-block"]}>
                    <div className={Styles["previous-round"]}>{this.renderRoundHistory()}</div>
                    <div className={Styles["statistic-btn"]}>
                        <StatisticButton isOpenStatistic={this.state.isOpenStatistic} handleToggle={this.toggleStatistic} /> 
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
            <div className='col-md-1 mx-auto mt-5'>
                <Loading />
            </div>
        );
    }

    private renderDisconnect() {
        return (
            <div className={`${Styles['block-wrapper']} ${this.props.overrideClasses}`}>
                <p>{gc.Translator.t('Common.connect_failed')}</p>
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
