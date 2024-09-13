import { inject, injectable } from "inversify";
import { LobbyStore } from "./lobby-store";

export namespace LobbyHandlers {
    @injectable()
    export class IncreaseConnectedCountHandler {
        constructor(@inject(LobbyStore) protected readonly store: LobbyStore) {}

        handle() {
            this.store.increaseConnectedCount();
        }
    }
}
