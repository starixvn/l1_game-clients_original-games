import * as gc from "@sg/sg-game-client";
import { FishPrawnCrabChoices, FishPrawnCrabSettlementResult } from "../type";

export interface IWinningResult extends FishPrawnCrabSettlementResult {
    winner: FishPrawnCrabChoices;
}

export class SettlementService {
    /**
     * Processes the settlement result to determine winning choices
     */
    public static getSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult): IWinningResult {
        const result = {
            winner: FishPrawnCrabChoices.fish,
            [FishPrawnCrabChoices.fish]: false,
            [FishPrawnCrabChoices.prawn]: false,
            [FishPrawnCrabChoices.crab]: false,
            [FishPrawnCrabChoices.rooster]: false,
            [FishPrawnCrabChoices.gourd]: false,
            [FishPrawnCrabChoices.stag]: false
        };

        if (settlementResult && typeof settlementResult === "object") {
            const data = settlementResult as Record<string, unknown>;

            // Process each choice
            Object.values(FishPrawnCrabChoices).forEach(choice => {
                result[choice] = !!data[choice];
                if (result[choice]) {
                    result.winner = choice;
                }
            });
        }

        return result;
    }

    /**
     * Extracts the winning symbols from a settlement result
     */
    public static getWinningSymbols(settlement: IWinningResult): FishPrawnCrabChoices[] {
        return Object.entries(settlement)
            .filter(([key, value]) => key !== 'winner' && value === true)
            .map(([key]) => key as FishPrawnCrabChoices);
    }
} 