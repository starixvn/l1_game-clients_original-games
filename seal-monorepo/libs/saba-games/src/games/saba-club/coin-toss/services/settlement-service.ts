import * as gc from "@sg/sg-game-client";
import { CoinTossChoices, CoinTossSettlementResult } from "../type";
import { createEmptySettlementResult } from "../coin-toss-utils";

export interface IWinningResult extends CoinTossSettlementResult {
    winner: CoinTossChoices;
}

export class SettlementService {
    public static getSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult): IWinningResult {
        const result = createEmptySettlementResult();

        if (settlementResult && typeof settlementResult === "object") {
            const data = settlementResult as Record<string, unknown>;

            Object.values(CoinTossChoices).forEach(choice => {
                result[choice] = !!data[choice];
                if (result[choice]) {
                    result.winner = choice;
                }
            });
        }

        return result;
    }

    public static getWinningSymbols(settlement: IWinningResult): CoinTossChoices[] {
        return Object.entries(settlement)
            .filter(([key, value]) => key !== 'winner' && value === true)
            .map(([key]) => key as CoinTossChoices);
    }
}