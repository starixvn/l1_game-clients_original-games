import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

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
