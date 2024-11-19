import * as gc from "@sg/sg-game-client";
import GameBase, { IGameBaseState } from ".";
import { GameBaseProps } from "./type";

import { handle, render } from "@sg/sg-observer";

export default abstract class GatewayGameBase<P extends GameBaseProps, S extends IGameBaseState> extends GameBase<P, S> {
    protected isJoinGame = false;

    componentDidMount() {
        document.addEventListener("visibilitychange", this.onVisibilityChange);
        this.connectLiveGateway();
    }

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler, (handler) => handler.handleGateway())
    connectLiveGateway() {}

    @render(gc.Connection.ConnectionStore, (store) => store.getConnectionStatus())
    dispatchServiceAction(status: gc.Connection.TConnectionStatus) {
        if (!status.isConnected) {
            return;
        }

        !this.isJoinGame && this.joinGame();
        status.isAuthorized && this.signIn();
    }

    @handle(gc.Connection.ConnectionHandlers.JoinGameHandler)
    joinGame() {
        this.isJoinGame = true;
    }

    @handle(gc.Connection.ConnectionHandlers.SignInHandler)
    signIn() {}

    override handleConnected(signedIn: boolean) {
        signedIn && this.inGameLiveGateway();
    }

    @handle(gc.Connection.ConnectionHandlers.InGameHandler, (handler) => handler.handleGateway())
    inGameLiveGateway() {}
}
