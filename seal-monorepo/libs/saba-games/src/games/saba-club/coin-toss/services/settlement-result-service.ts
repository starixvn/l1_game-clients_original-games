import * as gc from '@sg/sg-game-client';
import { CoinTossChoices, CoinTossSettlementResult } from '../type';
import { createEmptySettlementResult } from '../coin-toss-utils';

export interface ISettlementResultService {
    getSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult): CoinTossSettlementResult & { winner: CoinTossChoices };
    getWinningChoices(settlementResult: gc.GameServiceMessage.TSettlementResult): CoinTossChoices[];
    getWinningTextList(settlementResult: gc.GameServiceMessage.TSettlementResult): string[];
    getWinningTextListByResult(result: gc.GameServiceMessage.TResult): string[];
}

export class SettlementResultService implements ISettlementResultService {
    getSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult): CoinTossSettlementResult & { winner: CoinTossChoices } {
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

    getWinningChoices(settlementResult: gc.GameServiceMessage.TSettlementResult): CoinTossChoices[] {
        if (!settlementResult) return [];

        const settlement = this.getSettlementResult(settlementResult);
        return Object.entries(settlement)
            .filter(([key, value]) => key !== 'winner' && value === true)
            .map(([key]) => key as CoinTossChoices);
    }

    getWinningTextList(settlementResult: gc.GameServiceMessage.TSettlementResult): string[] {
        if (!settlementResult) return [];

        const winningSymbols = this.getWinningChoices(settlementResult)
            .map(choice => gc.Translator.translate(`CoinToss.glossary_${choice}`));
        return winningSymbols;
    }

    getWinningTextListByResult(result: gc.GameServiceMessage.TResult): string[] {
        if (!result || typeof result !== 'object' || Object.keys(result).length === 0) return [];

        const diceResult = result as Record<string, number>;

        const diceValues = [
            diceResult.dice1,
            diceResult.dice2,
            diceResult.dice3
        ];

        return diceValues
            .map(value => this.diceValueToSymbolName(value))
            .filter(Boolean)
            .map(choice => gc.Translator.translate(`CoinToss.glossary_${choice}`));
    }

    private diceValueToSymbolName(value: number): CoinTossChoices | null {
        switch (value) {
            case 0: return CoinTossChoices.head;
            case 1: return CoinTossChoices.tail;
            default: return null;
        }
    }
} 