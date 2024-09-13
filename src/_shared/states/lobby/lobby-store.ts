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

    connectedCount: number = 0;

    increaseConnectedCount() {
        this.connectedCount = +1;
    }
}
