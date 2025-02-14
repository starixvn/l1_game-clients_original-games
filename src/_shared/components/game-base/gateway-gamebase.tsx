import * as gc from "@sg/sg-game-client";
import GameBase, { IGameBaseState } from ".";
import { GameBaseProps } from "./type";
import React from "react";
import { handle, render } from "@sg/sg-observer";
export { GameHeader } from "./game-header";

export default abstract class GatewayGameBase<P extends GameBaseProps, S extends IGameBaseState> extends GameBase<P, S> {
    protected isJoinGame = false;

    componentDidMount() {
        document.addEventListener("visibilitychange", this.onVisibilityChange);
        this.connectLiveGateway();
    }

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler, (handler) => handler.handleGateway())
    connectLiveGateway() { }

    @render(gc.Connection.ConnectionStore, (store) => store.isConnected)
    handleJoinGame(isConnected: boolean) {
        if (isConnected) {
            !this.isJoinGame && this.joinGame();
        }
    }

    @handle(gc.Connection.ConnectionHandlers.JoinGameHandler)
    joinGame() {
        this.isJoinGame = true;
    }

    @handle(gc.Connection.ConnectionHandlers.SignInHandler)
    signIn() { }

    override handleConnected(signedIn: boolean) {
        signedIn && this.inGameLiveGateway();
    }

    @handle(gc.Connection.ConnectionHandlers.InGameHandler, (handler) => handler.handleGateway())
    inGameLiveGateway() { }
}
