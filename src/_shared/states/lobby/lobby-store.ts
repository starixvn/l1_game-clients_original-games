import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

export enum CurrentGameConnectedType {
    NONE = "none",
    CONNECTED = "connected",
    DISCONNECTED = "disconnected",
}

@injectable()
export class LobbyStore {
    constructor() {
        makeAutoObservable(this);
    }

    tryToConnectCount: number = 0;

    handleTryToConnect() {
        this.tryToConnectCount += 1;
    }
}
