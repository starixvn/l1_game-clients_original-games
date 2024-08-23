import * as gc from "@sg/sg-game-client";
import * as Observer from "observer";
import { ObserverComponent } from "./observer-component/observer-component";

const { handle, render } = Observer;

const { Auth, AppTypes } = gc;

export default class GameConnection extends ObserverComponent {
    protected system: number = AppTypes.Club;

    openGameCallback = () => {};

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler)
    connectToService() {}

    @render(gc.JoinGame.JoinGameStore, (store) => store.toGame, { fireImmediately: false })
    requestOpenGame() {
        this.openGameCallback();
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.startNewRound, { fireImmediately: false })
    requestOpenGameWhenStartNewRound() {
        if (this.system === AppTypes.Instant) {
            this.openGameCallback();
        }
    }

    @render(Auth.AuthStore, (store) => store.system)
    openGame(system: number) {
        this.system = system;
    }
}
