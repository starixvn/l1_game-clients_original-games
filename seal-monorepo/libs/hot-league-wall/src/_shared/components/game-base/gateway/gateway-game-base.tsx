import * as gc from '@sg/sg-game-client';
import { handle, render } from '@sg/sg-observer';
import React from 'react';
import { StorageManager, localStorageKeys } from '../../../utils/storage-manager';
import { ILatestBetRecord } from '../../bet-panel/bet-panel';
import AuthorizationHandler from '../../../handlers/authorization-handler';
import GameBase from '../core/game-base.core';
import GameUIRenderer from '../ui/game-ui-renderer';
import GameSettlementHandler from '../game-logic/game-settlement-handler';
import RoundHandler from '../game-logic/round-handler';
import { IGatewayGameBaseState } from '../interfaces/gateway-types';
import { GameBaseProps } from '../type';

/**
 * GatewayGameBase - Implementation of GameBase for gateway games
 * Adds gateway-specific functionality like authorization and connection handling
 */
class GatewayGameBase<P extends GameBaseProps, S extends IGatewayGameBaseState> extends GameBase<P, S> {
    private authHandler: AuthorizationHandler;
    private uiRenderer: GameUIRenderer<P, S>;
    private settlementHandler: GameSettlementHandler<S>;
    private roundHandler: RoundHandler<S>;

    constructor(props: P) {
        super(props);
        this.state = {
            ...this.state,
            isAuthorized: false,
            isSignedIn: false,
        } as S;

        this.authHandler = new AuthorizationHandler(
            this.state.isAuthorized,
            this.state.isSignedIn,
            () => this.signIn(),
            () => this.autoCreateNickname(),
        );

        // Initialize handlers
        this.uiRenderer = new GameUIRenderer<P, S>();
        this.settlementHandler = new GameSettlementHandler<S>();
        this.roundHandler = new RoundHandler<S>();
    }

    // -------------------------------------------------------------------------
    // AUTHORIZATION HANDLING
    // -------------------------------------------------------------------------

    private isRoundIdMatching(currentRoundId: number): boolean {
        const betHistory = StorageManager.get(localStorageKeys.betHistory) as ILatestBetRecord[] | null;
        if (!betHistory || !Array.isArray(betHistory)) return false;
        const storedGame = betHistory.find((bet) => bet.namespace === this.props.namespace);
        const isMatching = storedGame ? currentRoundId === storedGame.roundId : false;
        return isMatching;
    }

    override processAuthorizationIfRoundMatches(roundId: number): void {
        if (!this.isRoundIdMatching(roundId)) {
            return;
        }
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
    protected autoCreateNickname(): void {
        // Implementation left empty as in original
    }

    // -------------------------------------------------------------------------
    // GATEWAY CONNECTION HANDLING
    // -------------------------------------------------------------------------

    @render(gc.GatewayConnection.GatewayConnectionStore, (store) => store.isConnected)
    handleConnectLiveGatewayForGame(isConnected: boolean): void {
        if (isConnected) {
            this.connectLiveGateway();
        }
    }

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler, (handler) => handler.handleGateway())
    override connectLiveGateway(): void {
        // Implementation left empty as in original
    }

    @render(gc.Connection.ConnectionStore, (store) => store.isConnected)
    handleJoinGame(isConnected: boolean): void {
        if (isConnected) {
            this.joinGame();
        }
    }

    @handle(gc.Connection.ConnectionHandlers.JoinGameHandler)
    override joinGame(): void {
        this.processAuthorizationIfRoundMatches(this.state.roundId);
    }

    @handle(gc.Connection.ConnectionHandlers.SignInHandler)
    signIn(): void {
        // Implementation left empty as in original
    }

    override handleConnected(signedIn: boolean): void {
        signedIn && this.inGameLiveGateway();
    }

    @handle(gc.Connection.ConnectionHandlers.InGameHandler, (handler) => handler.handleGateway())
    inGameLiveGateway(): void {
        // Implementation left empty as in original
    }

    // -------------------------------------------------------------------------
    // IMPLEMENTATIONS OF ABSTRACT METHODS
    // -------------------------------------------------------------------------

    override closeConnect(): void {
        // Implementation needed
    }

    override showResult(
        hasAnimation: boolean,
        result?: gc.GameServiceMessage.TResult,
        settlementResult?: gc.GameServiceMessage.TSettlementResult,
    ): Promise<void> {
        // Basic implementation to satisfy abstract method
        return Promise.resolve();
    }

    // -------------------------------------------------------------------------
    // UI RENDERING
    // -------------------------------------------------------------------------

    @render(gc.Bet.BetStore, (store) => store.validBet)
    setIsValidBet(validBet: gc.Bet.IValidBet): void {
        this.settlementHandler.setIsValidBet(validBet, (state) => this.setState(state as Pick<S, keyof S>));
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundState)
    renderCountDownTimerState(roundState: string): void {
        this.roundHandler.renderCountDownTimerState(
            roundState,
            this.state,
            (state) => this.setState(state as Pick<S, keyof S>),
            this.resetBettingPanel
        );
    }

    override renderNotice(): JSX.Element {
        return this.uiRenderer.renderNotice(this.props, this.state);
    }

    override renderGameLayout(): JSX.Element {
        return this.uiRenderer.renderGameLayout(
            this.props,
            this.state,
            (state) => this.setState(state as Pick<S, keyof S>),
            this.toggleStatistic,
            this.overrideClasses
        );
    }
}

export default GatewayGameBase; 