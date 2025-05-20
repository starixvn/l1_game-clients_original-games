import * as gc from '@sg/sg-game-client';
import { Settlements } from '@sg/sg-game-client';
import { handle, render } from '@sg/sg-observer';
import React from 'react';
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
import { RoundId } from '../round-id';
import CountDownTimer from '../count-down-timer';
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds/round-time-store';
import WarningDialog from '../notices/warning-dialog';
import { RoundStore } from '@sg/sg-game-client/dist/game/rounds';
import classNames from 'classnames';
import { SyncMemberSiteBalance } from '../../utils/sync-member-site-balance';

// Breaking down the state into smaller interfaces for better organization
export interface ConnectionState {
    isConnected: boolean;
    isConnectFailed: boolean;
    initialized: boolean;
}

export interface GameState {
    gameId: number;
    roundId: number;
    roundState: string;
    isAllowedBet: boolean;
    isShowNextRoundMessage: boolean;
}

export interface UIState {
    showDisabledPopup: boolean;
    isOpenStatistic: boolean;
    activePanelId: any;
    showBetPanel: boolean;
    isPopupVisible?: boolean;
}

export interface SettlementState {
    statusSettlement?: gc.GameServiceMessage.Status;
    isFinishShowResult: boolean;
}

export interface IGameBaseState extends ConnectionState, GameState, UIState, SettlementState { }

interface GameStyleOverrides {
    [key: string]: string;
}

// GameConnectionService - Responsible for connection-related functionalities
export class GameConnectionService {
    static createConnection(component: GameBase<any, any>) {
        document.addEventListener('visibilitychange', component.onVisibilityChange);
        component.connectToServiceGateway();
    }

    static terminateConnection(component: GameBase<any, any>) {
        component.terminateConnection();
    }

    static handleReconnect(component: GameBase<any, any>) {
        GameConnectionService.terminateConnection(component);
        GameConnectionService.createConnection(component);
        component.resetStateWhenReconnect();
    }
}

// GameUIService - Responsible for UI-related functionalities
export class GameUIService {
    static resetBettingPanel(component: GameBase<any, any>) {
        component.setState({
            activePanelId: null,
            showBetPanel: false,
        });
    }

    static handleBetOption(component: GameBase<any, any>) {
        GameUIService.resetBettingPanel(component);
        component.setState({ isShowNextRoundMessage: true });
        setTimeout(() => {
            component.setState({ isShowNextRoundMessage: false });
        }, 3000);
    }

    static toggleStatistic(component: GameBase<any, any>) {
        component.setState({ isOpenStatistic: !component.state.isOpenStatistic });
    }

    static togglePopup(component: GameBase<any, any>) {
        component.setState({
            isPopupVisible: !component.state.isPopupVisible
        });
    }
}

// Rendering components - Split up responsibilities
export const GameLoadingView: React.FC = () => (
    <div className="col-md-1 mx-auto mt-5">
        <Loading />
    </div>
);

export const GameDisconnectView: React.FC<{ onReconnect: () => void }> = ({ onReconnect }) => {
    const reconnectText = gc.Translator.translate('Common.reconnect');
    return (
        <div className={Styles['block-wrapper']}>
            <div className={Styles['reconnect-btn-container']}>
                <p className={Styles['reconnect-text']}>{gc.Translator.t('Common.connect_failed')}</p>
                <button
                    className={`${'c-btn'} ${'c-btn--bet'} ${Styles['reconnect-btn']}`}
                    data-disabled={false}
                    onClick={onReconnect}
                >
                    <span className="c-text">{reconnectText}</span>
                </button>
            </div>
        </div>
    );
};

abstract class GameBase<P extends GameBaseProps, S extends IGameBaseState> extends React.PureComponent<P, S> {
    protected overrideClasses?: GameStyleOverrides;

    constructor(props: P) {
        super(props);
        this.state = {
            isConnectFailed: false,
            isConnected: false,
            initialized: false,
            showDisabledPopup: false,
            isOpenStatistic: false,
            isFinishShowResult: false,
            activePanelId: null,
            showBetPanel: false,
            isShowNextRoundMessage: false,
            roundId: 0,
            isAllowedBet: false,
            isPopupVisible: false,
            gameId: 0,
            roundState: '',
        } as S;

        // Bind methods - using arrow functions for most methods to avoid binding
        this.toggleStatistic = this.toggleStatistic.bind(this);
    }

    componentDidMount() {
        document.addEventListener('visibilitychange', this.onVisibilityChange);
    }

    componentWillUnmount() {
        this.onDestroy();
        document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }

    onDestroy() {
        this.closeConnect();
    }

    // Abstract methods to be implemented by derived classes
    abstract closeConnect(): void;
    abstract joinGame(): void;
    abstract connectLiveGateway(): void;
    abstract processAuthorizationIfRoundMatches(roundId: number): void;
    abstract showResult(
        hasAnimation: boolean,
        result?: gc.GameServiceMessage.TResult,
        settlementResult?: gc.GameServiceMessage.TSettlementResult,
    ): Promise<void>;

    // Event handlers
    onVisibilityChange = () => { };

    // Connection handlers
    @handle(gc.GatewayConnection.GatewayConnectionHandlers.ConnectHandler, (handler) => handler.handle())
    connectToServiceGateway() { }

    @handle(gc.Connection.ConnectionHandlers.CloseConnectHandler, (handler) => handler.handle())
    terminateConnection() { }

    @handle(gc.Connection.ConnectionHandlers.InGameHandler)
    inGame() {
        return this.props.namespace;
    }

    @render(gc.Connection.ConnectionStore, (store) => store.isSignedIn)
    handleConnected(isSignedIn: boolean) {
        isSignedIn && this.inGame();
    }

    // Render handlers
    @render(gc.Bet.BetStore, (store) => store.validBet)
    setIsValidBet(validBet: gc.Bet.IValidBet) {
        if (validBet?.value) {
            SyncMemberSiteBalance.getInstance().executeSyncBalance();
        }
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
        this.setState({ isConnectFailed });
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
        if (!showPopup && this.state.showDisabledPopup) {
            this.joinGame();
        }
        this.setState({ showDisabledPopup: showPopup } as IGameBaseState);
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundState)
    renderCountDownTimerState(roundState: string) {
        if (roundState === ROUND_STATE.PLACING_BET) {
            this.setState({ isShowNextRoundMessage: false });
        }

        if (roundState === ROUND_STATE.LOCKING_BET || roundState === ROUND_STATE.SHOW_RESULT) {
            this.resetBettingPanel();
        }

        this.setState({ roundState });
    }

    @render(RoundStore, (store) => store.clientRoundId)
    handleRoundIdChange(roundId: number) {
        this.setState({ roundId });
        this.processAuthorizationIfRoundMatches(roundId);
    }

    // UI methods - implement them directly in GameBase 
    toggleStatistic = () => {
        this.setState({ isOpenStatistic: !this.state.isOpenStatistic });
    }

    resetBettingPanel = () => {
        this.setState({
            activePanelId: null,
            showBetPanel: false,
        });
    };

    handleBetOption = () => {
        this.resetBettingPanel();
        this.setState({ isShowNextRoundMessage: true });
        setTimeout(() => {
            this.setState({ isShowNextRoundMessage: false });
        }, 3000);
    };

    protected togglePopup(): void {
        this.setState({
            isPopupVisible: !this.state.isPopupVisible
        });
    }

    // Helper methods
    isValidResult(result?: gc.GameServiceMessage.TResult, settlementResult?: gc.GameServiceMessage.TSettlementResult) {
        return !!result && !!settlementResult;
    }

    // UI Components - these should be implemented by derived classes or overridden if needed
    renderNotice(): JSX.Element {
        return (
            <Notice
                namespace={this.props.namespace}
                isDisableGame={this.state.showDisabledPopup}
                language={this.props.language}
            />
        );
    }

    renderWarning(): JSX.Element {
        return <Warning namespace={this.props.namespace} />;
    }

    renderRoundIdSection() {
        const { roundId, roundState } = this.state;
        return <RoundId clientRoundId={roundId} roundState={roundState} />;
    }

    renderCountDownTimer() {
        return (
            <CountDownTimer
                namespace={this.props.namespace}
                onComplete={() => {
                    this.setState({ isAllowedBet: true });
                }}
            />
        );
    }

    renderResultBlock(): JSX.Element {
        return <></>;
    }

    renderRoundHistory(): JSX.Element {
        return <></>;
    }

    renderStatistic(): JSX.Element {
        return <>Statistic</>;
    }

    renderWaitingForNextRound() {
        if (!this.state.isShowNextRoundMessage) {
            return <></>;
        }
        return (
            <WarningDialog key={`warning-bet`}>
                <div className={Styles['title-white']}>{gc.Translator.t('Common.message_placebet_next_round')}</div>
            </WarningDialog>
        );
    }

    protected renderGameHeader(): JSX.Element {
        return (
            <div className={`${Styles['info']} ${this.overrideClasses?.info}`}>
                {this.renderRoundIdSection()}
                {this.renderCountDownTimer()}
            </div>
        );
    }

    protected renderGameContent(): JSX.Element {
        return (
            <div className={`${Styles['result']} ${this.overrideClasses?.result}`}>
                {this.renderResultBlock()}
            </div>
        );
    }

    protected renderGameFooter(): JSX.Element {
        return (
            <div
                className={classNames(
                    Styles['bet-options'],
                    {
                        [Styles['disabled']]: !this.state.isAllowedBet,
                    },
                    this.overrideClasses?.betOptions,
                )}
            >
                {this.renderBettingBlock()}
                <ConfirmBet namespace={this.props.namespace} />
                <div className={`${Styles['animation-balance']} ${Styles[`game-${this.state.gameId}`]}`}>
                    {this.renderAnimationBalance()}
                </div>
            </div>
        );
    }

    protected renderGamePopup(): JSX.Element {
        return (
            <div className={Styles['history-block']}>
                <div className={Styles['statistic-btn']}>
                    <StatisticButton isOpenStatistic={this.state.isOpenStatistic} handleToggle={this.toggleStatistic} />
                </div>
                {this.renderNotice()}
                {this.renderWarning()}
                {this.renderWaitingForNextRound()}
                {this.state.isOpenStatistic && this.renderStatistic()}
            </div>
        );
    }

    protected renderBettingBlock(): JSX.Element {
        return <></>;
    }

    protected renderAnimationBalance() {
        const { statusSettlement, isFinishShowResult } = this.state;

        if (!statusSettlement || !statusSettlement.win) {
            return <></>;
        }

        if (isFinishShowResult) {
            return <AnimationBalance winBet={statusSettlement?.bet} />;
        }

        return null;
    }

    /**
     * Override this method to provide a completely custom game layout
     * By default, it uses the standard layout template
     */
    protected getGameLayout(): JSX.Element | null {
        return null;
    }

    // Main render methods
    render() {
        return (
            <GameContainer>
                <GameContextProvider value={{ ...this.props }}>{this.getRenderTemplate()}</GameContextProvider>
            </GameContainer>
        );
    }

    getRenderTemplate() {
        const { isConnected, isConnectFailed, initialized: isGameConfigInitialized, showDisabledPopup } = this.state;

        if (isConnectFailed) {
            return <GameDisconnectView onReconnect={this.handleReconnect} />;
        }

        const isFirstInit = !isGameConfigInitialized && !showDisabledPopup;
        if (isFirstInit || showDisabledPopup) {
            return showDisabledPopup ? this.renderNotice() : <GameLoadingView />;
        }

        if (!isConnected) {
            return <GameDisconnectView onReconnect={this.handleReconnect} />;
        }

        // Allow games to override the entire layout structure if needed
        const customLayout = this.getGameLayout();
        if (customLayout) {
            return customLayout;
        }

        // Standard layout template
        return (
            <>
                <div className={`${Styles['block-wrapper']} ${this.overrideClasses?.blockWrapper}`}>
                    {this.renderGameHeader()}
                    {this.renderGameContent()}
                    {this.renderGameFooter()}
                </div>
                {this.renderGamePopup()}
            </>
        );
    }

    // Remove handleReconnect from here since it's in GameConnectionService already
    handleReconnect = () => {
        GameConnectionService.handleReconnect(this);
    };

    // Add back this method
    resetStateWhenReconnect() {
        this.setState({
            isOpenStatistic: false,
        });
        this.resetBettingPanel();
    }

    // Add back the createConnection method for completeness
    createConnection() {
        document.addEventListener('visibilitychange', this.onVisibilityChange);
        this.connectToServiceGateway();
    }
}

export default GameBase;
