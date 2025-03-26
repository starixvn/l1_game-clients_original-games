import * as gc from '@sg/sg-game-client';
import GameBase, { IGameBaseState } from '.';
import { GameBaseProps } from './type';
import { handle, render } from '@sg/sg-observer';
import { RoundStore } from '@sg/sg-game-client/dist/game/rounds';
import { StorageManager, localStorageKeys } from '../../utils/storage-manager';
import { ILatestBetRecord } from '../bet-panel/bet-panel';
import AuthorizationHandler from '../../handlers/authorization-handler';

export interface IGatewayGameBaseState extends IGameBaseState {
    isAuthorized: boolean;
    isSignedIn: boolean;
}

export default abstract class GatewayGameBase<P extends GameBaseProps, S extends IGatewayGameBaseState> extends GameBase<
    P,
    S
> {
    protected isJoinGame = false;
    private authHandler: AuthorizationHandler;

    constructor(props: P) {
        super(props);
        this.state = {
            ...this.state,
            isAuthorized: false,
            isSignedIn: false
        } as S;

        this.authHandler = new AuthorizationHandler(
            this.state.isAuthorized,
            this.state.isSignedIn,
            () => this.signIn(),
            () => this.autoCreateNickname()
        );
    }

    componentDidMount() {
        document.addEventListener('visibilitychange', this.onVisibilityChange);
        this.connectLiveGateway();
    }

    /**
     * Check if current round ID matches with stored round ID for this game
     * @param currentRoundId The current round ID of the game
     * @returns true if round IDs match for the current game namespace
     */
    private isMatchingRoundId(currentRoundId: number): boolean {
            const betHistory = StorageManager.get(localStorageKeys.betHistory) as ILatestBetRecord[];
            if (!betHistory || !Array.isArray(betHistory)) return false;
            const currentNamespace = this.props.namespace;
            if (!currentNamespace) return false;

            const storedGame = betHistory.find(bet => bet.namespace === currentNamespace);
            if (!storedGame) return false;
            return currentRoundId === storedGame.roundId;
    }




    @render(gc.Auth.AuthStore, (store) => store.isAuthorized)
    protected handleAuthorized(isAuthorized: boolean) {
        this.setState({ isAuthorized });
    }

    @handle(gc.Auth.AuthHandlers.Authorize, (handler) => handler.handleAutoGenerateName())
    protected autoCreateNickname() {}

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler, (handler) => handler.handleGateway())
    connectLiveGateway() {}

    @render(gc.Connection.ConnectionStore, (store) => store.isConnected)
    handleJoinGame(isConnected: boolean) {
        if (isConnected) {
            !this.isJoinGame && this.joinGame();
            
            if (this.isMatchingRoundId(this.state.roundId)) {
                this.authHandler = new AuthorizationHandler(
                    this.state.isAuthorized,
                    this.state.isSignedIn,
                    () => this.signIn(),
                    () => this.autoCreateNickname()
                );
                this.authHandler.handleWaitForAuthorize();
            }
        }
    }

    @handle(gc.Connection.ConnectionHandlers.JoinGameHandler)
    joinGame() {
        this.isJoinGame = true;
    }

    @handle(gc.Connection.ConnectionHandlers.SignInHandler)
    signIn() {
    }

    override handleConnected(signedIn: boolean) {
        signedIn && this.inGameLiveGateway();
    }

    @handle(gc.Connection.ConnectionHandlers.InGameHandler, (handler) => handler.handleGateway())
    inGameLiveGateway() {}
}
