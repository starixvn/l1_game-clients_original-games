import * as gc from '@sg/sg-game-client';
import { handle, render } from '@sg/sg-observer';
import { RoundStore } from '@sg/sg-game-client/dist/game/rounds';
import { StorageManager, localStorageKeys } from '../../utils/storage-manager';
import { ILatestBetRecord } from '../bet-panel/bet-panel';
import AuthorizationHandler from '../../handlers/authorization-handler';
import { GameBase } from './';
import { IGatewayGameBaseState } from './interfaces/gateway-types';
import { GameBaseProps } from './type';

abstract class GatewayGameBase<P extends GameBaseProps, S extends IGatewayGameBaseState> extends GameBase<P, S> {
    private authHandler: AuthorizationHandler;

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
    }

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
        this.setState({ isAuthorized });
    }

    @handle(gc.Auth.AuthHandlers.Authorize, (handler) => handler.handleAutoGenerateName())
    protected autoCreateNickname(): void {
        // Implementation left empty as in original
    }

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
}

export default GatewayGameBase;
