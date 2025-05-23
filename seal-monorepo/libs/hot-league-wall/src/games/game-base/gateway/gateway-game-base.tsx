import * as gc from '@sg/sg-game-client';
import { handle, render } from '@sg/sg-observer';
import React from 'react';
import { StorageManager, localStorageKeys } from '../../../_shared/utils/storage-manager';
import { ILatestBetRecord } from '../../../_shared/components/bet-panel/bet-panel';
import AuthorizationHandler from '../../../_shared/handlers/authorization-handler';
import GameBase from '../core/game-base.core';
import GameUIRenderer, { UIExtensionOptions } from '../ui/game-ui-renderer';
import GameSettlementHandler from '../game-logic/game-settlement-handler';
import RoundHandler from '../game-logic/round-handler';
import { IGatewayGameBaseState } from '../interfaces/gateway-types';
import { GameBaseProps } from '../type';

class GatewayGameBase<P extends GameBaseProps, S extends IGatewayGameBaseState> extends GameBase<P, S> {
    private authHandler: AuthorizationHandler;
    protected uiRenderer: GameUIRenderer<P, S>;
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

        this.uiRenderer = new GameUIRenderer<P, S>();
        this.settlementHandler = new GameSettlementHandler<S>();
        this.roundHandler = new RoundHandler<S>();
    }

    protected configureUIRenderer(): UIExtensionOptions {
        return {};
    }

    protected initializeUIRenderer(): void {
        const options = this.configureUIRenderer();
        if (Object.keys(options).length > 0) {
            this.uiRenderer.setExtensionOptions(options);
        }
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
        if (isConnected) this.connectLiveGateway();
    }

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler, (handler) => handler.handleGateway())
    override connectLiveGateway(): void { }

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
    override closeConnect(): void { }

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

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundState)
    renderRoundState(roundState: string): void {
        this.setState({ roundState } as Pick<S, keyof S>);
    }

    @render(gc.Rounds.RoundStore, (store) => store.clientRoundId)
    renderRoundId(roundId: number): void {
        this.setState({ roundId: roundId } as Pick<S, keyof S>);
    }

    override renderNotice(): JSX.Element {
        return this.uiRenderer.renderNotice(this.props, this.state);
    }

    override renderGameLayout(): JSX.Element {
        const customHeaderSection = this.getGameHeaderSection();
        const customContentSection = this.getGameContentSection();
        const customFooterSection = this.getGameFooterSection();
        const customPopupSection = this.getGamePopupSection();
        const backgroundImage = this.getGameBackgroundImage();

        return this.uiRenderer.renderGameLayout(
            this.props,
            this.state,
            (state) => this.setState(state as Pick<S, keyof S>),
            this.toggleStatistic,
            this.overrideClasses,
            backgroundImage || undefined,
            customHeaderSection,
            customContentSection,
            customFooterSection,
            customPopupSection
        );
    }
}

export default GatewayGameBase;