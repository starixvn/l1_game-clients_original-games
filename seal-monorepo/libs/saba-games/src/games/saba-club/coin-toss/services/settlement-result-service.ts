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

    //TODO: 更新 winning text
    getWinningTextListByResult(result: gc.GameServiceMessage.TResult): string[] {
        if (!result || typeof result !== 'object' || Object.keys(result).length === 0) return [];

        const coinResult = result as Record<string, boolean>;

        const coinValues = [
            coinResult.head,
            coinResult.tail
        ];

        return coinValues
            .map(value => this.coinValueToSymbolName(value))
            .filter(Boolean)
            .map(choice => gc.Translator.translate(`CoinToss.glossary_${choice}`));
    }

    private coinValueToSymbolName(value: boolean): CoinTossChoices | null {
        switch (value) {
            case true: return CoinTossChoices.head;
            case false: return CoinTossChoices.tail;
            default: return null;
        }
    }
} 