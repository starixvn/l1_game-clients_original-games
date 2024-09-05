import * as gc from "@sg/sg-game-client";
import { inject, injectable } from "inversify";

@injectable()
export class BetPanelHandler implements gc.Shared.IHandler<number> {
    @inject(gc.Bet.BetStore) private readonly betStore;

    constructor(@inject(gc.Bet.BetStore) betStore: gc.Bet.BetStore) {
        this.betStore = betStore;
    }

    async handle(amount: number) {
        this.betStore.amount = amount;
    }
}
