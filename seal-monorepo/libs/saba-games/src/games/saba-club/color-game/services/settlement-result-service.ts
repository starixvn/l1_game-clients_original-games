import * as gc from '@sg/sg-game-client';
import { ColorGameChoices, ColorGameSettlementResult } from '../type';

export interface ISettlementResultService {
    getSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult): ColorGameSettlementResult & { winner: ColorGameChoices };
    getWinningChoices(settlementResult: gc.GameServiceMessage.TSettlementResult): ColorGameChoices[];
    getWinningTextList(settlementResult: gc.GameServiceMessage.TSettlementResult): string;
}

export class SettlementResultService implements ISettlementResultService {
    getSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult): ColorGameSettlementResult & { winner: ColorGameChoices } {
        const result = {
            winner: ColorGameChoices.yellow,
            [ColorGameChoices.yellow]: false,
            [ColorGameChoices.red]: false,
            [ColorGameChoices.pink]: false,
            [ColorGameChoices.white]: false,
            [ColorGameChoices.blue]: false,
            [ColorGameChoices.green]: false
        };

        if (settlementResult && typeof settlementResult === "object") {
            const data = settlementResult as Record<string, unknown>;

            Object.values(ColorGameChoices).forEach(choice => {
                result[choice] = !!data[choice];
                if (result[choice]) {
                    result.winner = choice;
                }
            });
        }

        return result;
    }

    getWinningChoices(settlementResult: gc.GameServiceMessage.TSettlementResult): ColorGameChoices[] {
        if (!settlementResult) return [];

        const settlement = this.getSettlementResult(settlementResult);
        return Object.entries(settlement)
            .filter(([key, value]) => key !== 'winner' && value === true)
            .map(([key]) => key as ColorGameChoices);
    }

    getWinningTextList(settlementResult: gc.GameServiceMessage.TSettlementResult): string {
        if (!settlementResult) return "";

        const winningSymbols = this.getWinningChoices(settlementResult)
            .map(choice => gc.Translator.translate(`ColorGame.glossary_${choice}`));

        return winningSymbols.join(', ');
    }
} 