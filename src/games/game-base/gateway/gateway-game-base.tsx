import * as gc from '@sg/sg-game-client';
import { handle, render } from '@sg/sg-observer';
import React from 'react';
import { StorageManager, localStorageKeys } from '../../../_shared/utils/storage-manager';
import { ILatestBetRecord } from '../../../_shared/components/bet-panel/bet-panel';
import AuthorizationHandler from '../../../_shared/handlers/authorization-handler';
import GameBase from '../core/game-base.core';
import GameUIRenderer, { UIExtensionOptions } from '../ui/game-ui-renderer';
import { IGatewayGameBaseState } from '../interfaces/gateway-types';
import { GameBaseProps } from '../type';
import { SyncMemberSiteBalance } from '../../../_shared/utils/callback-singleton/sync-member-site-balance';
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds/round-time-store';
import { Settlements } from '@sg/sg-game-client';
import { FunctionUtils } from '../../../_shared/utils/funtion-utils';

// Connection Management Configuration
const CONNECTION_CONFIG = {
    MAX_CONNECTIONS: 1000,
    INACTIVITY_TIMEOUT: 5 * 60 * 1000, // 5 minutes
    MAX_ATTEMPTS_PER_MINUTE: 3,
    POLLING_INTERVAL: 5000, // 5 seconds
    HEARTBEAT_INTERVAL: 30000, // 30 seconds
    SERVICE_HEALTH_CHECK_INTERVAL: 60000, // 1 minute
} as const;

// Global connection management
class ConnectionManager {
    private static activeConnections = 0;
    private static connectionAttempts = new Map<string, { count: number; lastReset: number }>();
    private static serviceHealthStatus: 'healthy' | 'degraded' | 'overloaded' = 'healthy';
    private static connectionQueue: Array<{ component: any; priority: number; timestamp: number }> = [];
    private static isProcessingQueue = false;
    private static healthCheckInterval?: NodeJS.Timeout;

    static canEstablishConnection(): boolean {
        return this.activeConnections < CONNECTION_CONFIG.MAX_CONNECTIONS;
    }

    static incrementConnection(): void {
        this.activeConnections++;
        console.log(`🔗 [ConnectionManager] Active connections: ${this.activeConnections}/${CONNECTION_CONFIG.MAX_CONNECTIONS}`);
    }

    static decrementConnection(): void {
        this.activeConnections = Math.max(0, this.activeConnections - 1);
        console.log(`🔗 [ConnectionManager] Active connections: ${this.activeConnections}/${CONNECTION_CONFIG.MAX_CONNECTIONS}`);
    }

    static canAttemptConnection(userId: string): boolean {
        const now = Date.now();
        const userAttempts = this.connectionAttempts.get(userId);

        if (!userAttempts || now - userAttempts.lastReset > 60000) {
            this.connectionAttempts.set(userId, { count: 1, lastReset: now });
            return true;
        }

        if (userAttempts.count >= CONNECTION_CONFIG.MAX_ATTEMPTS_PER_MINUTE) {
            return false;
        }

        userAttempts.count++;
        return true;
    }

    static getServiceHealthStatus(): 'healthy' | 'degraded' | 'overloaded' {
        return this.serviceHealthStatus;
    }

    static setServiceHealthStatus(status: 'healthy' | 'degraded' | 'overloaded'): void {
        this.serviceHealthStatus = status;
        console.log(`🔗 [ConnectionManager] Service health status: ${status}`);
    }

    static addToQueue(component: any, priority: number): void {
        this.connectionQueue.push({
            component,
            priority,
            timestamp: Date.now()
        });

        // Sort by priority (lower number = higher priority)
        this.connectionQueue.sort((a, b) => a.priority - b.priority);

        console.log(`🔗 [ConnectionManager] Added to queue. Queue length: ${this.connectionQueue.length}`);

        if (!this.isProcessingQueue) {
            this.processQueue();
        }
    }

    private static processQueue(): void {
        this.isProcessingQueue = true;

        const processNext = () => {
            if (this.connectionQueue.length === 0) {
                this.isProcessingQueue = false;
                return;
            }

            const next = this.connectionQueue.shift();
            if (next && this.canEstablishConnection()) {
                console.log(`🔗 [ConnectionManager] Processing queued connection with priority ${next.priority}`);
                next.component.connectLiveGateway();
            }

            // Process next after delay to prevent overwhelming
            setTimeout(processNext, 1000);
        };

        processNext();
    }

    static startHealthCheck(): void {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
        }

        this.healthCheckInterval = setInterval(() => {
            this.checkServiceHealth();
        }, CONNECTION_CONFIG.SERVICE_HEALTH_CHECK_INTERVAL);
    }

    private static async checkServiceHealth(): Promise<void> {
        try {
            // Check server load based on active connections
            const connectionRatio = this.activeConnections / CONNECTION_CONFIG.MAX_CONNECTIONS;

            if (connectionRatio > 0.9) {
                this.setServiceHealthStatus('overloaded');
            } else if (connectionRatio > 0.7) {
                this.setServiceHealthStatus('degraded');
            } else {
                this.setServiceHealthStatus('healthy');
            }
        } catch (error) {
            console.error('🔗 [ConnectionManager] Health check failed:', error);
        }
    }

    static cleanup(): void {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
        }
    }
}

class GatewayGameBase<P extends GameBaseProps, S extends IGatewayGameBaseState> extends GameBase<P, S> {
    private authHandler: AuthorizationHandler;
    protected uiRenderer: GameUIRenderer<P, S>;
    private inactivityTimeout?: NodeJS.Timeout;
    private heartbeatInterval?: NodeJS.Timeout;
    private pollInterval?: NodeJS.Timeout;
    private lastActivityTime: number = Date.now();

    constructor(props: P) {
        super(props);
        this.state = {
            ...this.state,
            isAuthorized: false,
            isSignedIn: false,
            isInPollingMode: false,
            connectionPriority: 3, // Default priority
        } as S;

        this.authHandler = new AuthorizationHandler(
            this.state.isAuthorized,
            this.state.isSignedIn,
            () => this.signIn(),
            () => this.autoCreateNickname(),
        );

        this.uiRenderer = new GameUIRenderer<P, S>();

        // Start connection manager health check
        ConnectionManager.startHealthCheck();
    }

    componentDidMount() {
        super.componentDidMount();
        this.startInactivityTimer();
        this.startHeartbeat();
        this.authHandler.handleWaitForAuthorize();

        // Add cleanup event listener only on client side
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', () => {
                ConnectionManager.cleanup();
            });
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.clearInactivityTimer();
        this.clearHeartbeat();
        this.clearPolling();
        ConnectionManager.decrementConnection();

        // Remove cleanup event listener
        if (typeof window !== 'undefined') {
            window.removeEventListener('beforeunload', () => {
                ConnectionManager.cleanup();
            });
        }
    }

    // CONNECTION MANAGEMENT METHODS
    private startInactivityTimer(): void {
        this.clearInactivityTimer();
        this.inactivityTimeout = setTimeout(() => {
            this.handleInactivityDisconnect();
        }, CONNECTION_CONFIG.INACTIVITY_TIMEOUT);
    }

    private clearInactivityTimer(): void {
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
            this.inactivityTimeout = undefined;
        }
    }

    private startHeartbeat(): void {
        this.clearHeartbeat();
        this.heartbeatInterval = setInterval(() => {
            this.sendHeartbeat();
        }, CONNECTION_CONFIG.HEARTBEAT_INTERVAL);
    }

    private clearHeartbeat(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = undefined;
        }
    }

    private clearPolling(): void {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = undefined;
        }
    }

    private updateActivityTime(): void {
        this.lastActivityTime = Date.now();
        this.resetInactivityTimer();
    }

    private resetInactivityTimer(): void {
        this.startInactivityTimer();
    }

    private handleInactivityDisconnect(): void {
        console.log('🔗 [GatewayGameBase] Disconnecting due to inactivity');
        this.closeConnect();
        this.setState({ isConnectFailed: true } as Pick<S, keyof S>);
    }

    private sendHeartbeat(): void {
        // Send heartbeat to keep connection alive
        try {
            // This would typically send a ping message to the server
            console.log('🔗 [GatewayGameBase] Sending heartbeat');
        } catch (error) {
            console.error('🔗 [GatewayGameBase] Heartbeat failed:', error);
        }
    }

    private getConnectionPriority(): number {
        // Higher priority for active users
        if (this.state.showBetPanel) return 1; // Active betting
        if (this.state.isOpenStatistic) return 2; // Viewing stats
        return 3; // Idle users
    }

    private enablePollingMode(): void {
        console.log('🔗 [GatewayGameBase] Enabling polling mode due to service overload');
        this.setState({ isInPollingMode: true } as S);
        this.startPollingForUpdates();
    }

    private startPollingForUpdates(): void {
        this.clearPolling();
        this.pollInterval = setInterval(() => {
            this.fetchGameUpdates();
        }, CONNECTION_CONFIG.POLLING_INTERVAL);
    }

    private async fetchGameUpdates(): Promise<void> {
        try {
            // HTTP request to get game state updates
            const response = await fetch(`/api/game/${this.props.namespace}/updates`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const updates = await response.json();
                this.handleGameUpdates(updates);
            }
        } catch (error) {
            console.error('🔗 [GatewayGameBase] Polling failed:', error);
        }
    }

    private handleGameUpdates(updates: any): void {
        // Handle game updates received via polling
        console.log('🔗 [GatewayGameBase] Received game updates via polling:', updates);
        // Implement update handling logic here
    }

    // Override activity tracking methods
    protected onUserActivity(): void {
        this.updateActivityTime();
        this.setState({ connectionPriority: this.getConnectionPriority() } as S);
    }

    // AUTHORIZATION METHODS
    private isRoundIdMatching(currentRoundId: number): boolean {
        const betHistory = StorageManager.get(localStorageKeys.betHistory) as ILatestBetRecord[] | null;
        if (!betHistory || !Array.isArray(betHistory)) return false;
        const storedGame = betHistory.find((bet) => bet.namespace === this.props.namespace);
        return storedGame ? currentRoundId === storedGame.roundId : false;
    }

    override processAuthorizationIfRoundMatches(roundId: number): void {
        if (!this.isRoundIdMatching(roundId)) return;

        this.authHandler = new AuthorizationHandler(
            this.state.isAuthorized,
            this.state.isSignedIn,
            () => this.signIn(),
            () => this.autoCreateNickname(),
        );
        this.authHandler.handleWaitForAuthorize();
    }

    @render(gc.Auth.AuthStore, (store) => store.isAuthorized)
    protected handleAuthorized(isAuthorized: boolean): void {
        this.setState({ isAuthorized } as Pick<S, keyof S>);
    }

    @handle(gc.Auth.AuthHandlers.Authorize, (handler) => handler.handleAutoGenerateName())
    protected autoCreateNickname(): void { }

    // CONNECTION METHODS
    @render(gc.GatewayConnection.GatewayConnectionStore, (store) => store.isConnected)
    handleConnectLiveGatewayForGame(isConnected: boolean): void {
        const healthStatus = ConnectionManager.getServiceHealthStatus();

        if (healthStatus === 'overloaded') {
            this.enablePollingMode();
            return;
        }

        if (isConnected) {
            this.connectLiveGateway();
        }
    }

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler, (handler) => handler.handle())
    override connectLiveGateway(): void {
        const userId = this.props.namespace || 'anonymous';

        // Check connection limits
        if (!ConnectionManager.canEstablishConnection()) {
            console.warn(`🔗 [GatewayGameBase] Connection limit reached for user: ${userId}`);
            ConnectionManager.addToQueue(this, this.getConnectionPriority());
            return;
        }

        // Check throttling
        if (!ConnectionManager.canAttemptConnection(userId)) {
            console.warn(`🔗 [GatewayGameBase] Connection attempts exceeded for user: ${userId}`);
            this.setState({ isConnectFailed: true } as S);
            return;
        }

        // Proceed with connection
        ConnectionManager.incrementConnection();
        console.log(`🔗 [GatewayGameBase] Establishing connection for user: ${userId}`);

        // Connection logic will be handled by the specific game implementation
    }

    @render(gc.Connection.ConnectionStore, (store) => store.isConnected)
    handleJoinGame(isConnected: boolean): void {
        if (isConnected) this.joinGame();
    }

    @handle(gc.Connection.ConnectionHandlers.JoinGameHandler)
    override joinGame(): void {
        this.processAuthorizationIfRoundMatches(this.state.roundId);
    }

    @handle(gc.Connection.ConnectionHandlers.SignInHandler)
    signIn(): void { }

    override handleConnected(signedIn: boolean): void {
        if (signedIn) this.inGameLiveGateway();
    }

    @handle(gc.Connection.ConnectionHandlers.InGameHandler, (handler) => handler.handleGateway())
    inGameLiveGateway(): void { }

    // ABSTRACT METHOD IMPLEMENTATIONS
    override closeConnect(): void {
        ConnectionManager.decrementConnection();
        this.clearPolling();
        this.setState({ isInPollingMode: false } as S);
    }

    override showResult(
        hasAnimation: boolean,
        result?: gc.GameServiceMessage.TResult,
        settlementResult?: gc.GameServiceMessage.TSettlementResult,
    ): Promise<void> {
        return Promise.resolve();
    }

    // UI AND STATE HANDLING
    @render(gc.Bet.BetStore, (store) => store.validBet)
    setIsValidBet(validBet: gc.Bet.IValidBet): void {
        if (validBet?.value) {
            SyncMemberSiteBalance.getInstance().executeSyncBalance();
            this.onUserActivity(); // Track betting activity
        }
    }

    @render(Settlements.SettlementStatusStore, (store) => store.settlementStatus, {
        fireImmediately: false,
    })
    assignStatus(settlementStatus: any): void {
        this.setState({ statusSettlement: settlementStatus } as Pick<S, keyof S>);
    }

    @render(Settlements.SettlementStore, (store) => store.currentFinish, {
        fireImmediately: false,
    })
    async renderCurrentFinish(
        currentFinish: gc.GameServiceMessage.Finish,
    ) {
        console.log('renderCurrentFinish', currentFinish);
        if (!currentFinish) {
            return;
        }
        const { result, settlementResult } = currentFinish;

        if (!this.isValidResult(result, settlementResult)) {
            return;
        }
        this.setState({ isFinishShowResult: false } as Pick<S, keyof S>);

        await FunctionUtils.delay(this.state.settlementResultDuration * 1000);

        this.showResult(true, result, settlementResult).then(() => {
            this.finishShowResult();
        });
    }

    @handle(Settlements.SettlementUIHandlers.FinishedShowResult)
    finishShowResult(): void {
        console.log('finishShowResult');
        this.setState({ isFinishShowResult: true } as Pick<S, keyof S>);
    }

    private isValidResult(result?: gc.GameServiceMessage.TResult, settlementResult?: gc.GameServiceMessage.TSettlementResult): boolean {
        return !!result && !!settlementResult;
    }

    // Round Handler Logic
    @render(gc.Rounds.RoundTimeStore, (store) => store.roundState)
    renderCountDownTimerState(roundState: string): void {
        if (roundState === ROUND_STATE.PLACING_BET) {
            this.setState({ isShowNextRoundMessage: false } as Pick<S, keyof S>);
        }

        if (roundState === ROUND_STATE.LOCKING_BET || roundState === ROUND_STATE.SHOW_RESULT) {
            this.resetBettingPanel();
        }

        this.setState({ roundState } as Pick<S, keyof S>);
        this.onUserActivity(); // Track round state changes
    }

    @render(gc.Rounds.RoundStore, (store) => store.clientRoundId)
    handleRoundIdChange(roundId: number): void {
        if (this.state.roundState !== ROUND_STATE.NONE) {
            this.setState({ roundId } as Pick<S, keyof S>);
        }
        this.processAuthorizationIfRoundMatches(roundId);
    }

    handleBetOption(): void {
        this.resetBettingPanel();
        this.setState({ isShowNextRoundMessage: true } as Pick<S, keyof S>);
        setTimeout(() => {
            this.setState({ isShowNextRoundMessage: false } as Pick<S, keyof S>);
        }, 3000);
        this.onUserActivity(); // Track betting activity
    }

    override renderNotice(): JSX.Element {
        return this.uiRenderer.renderNotice(this.props, this.state);
    }

    override renderGameLayout(): JSX.Element {
        const customHeaderSection = this.getGameHeaderSection();
        const customContentSection = this.getGameContentSection();
        const customFooterSection = this.getGameFooterSection();
        const customHistorySection = this.getGameHistorySection();
        const backgroundImage = this.getGameBackgroundImage();

        return this.uiRenderer.renderGameLayout(
            this.props,
            this.state,
            (state) => this.setState(state as Pick<S, keyof S>),
            this.overrideClasses,
            backgroundImage || undefined,
            customHeaderSection,
            customContentSection,
            customFooterSection,
            customHistorySection
        );
    }
}

export default GatewayGameBase;