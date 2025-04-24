import * as gc from '@sg/sg-game-client';
import { BetCounts, BetResult } from './types';

/**
 * Counts the occurrence of each result value from round histories
 */
export const countResult = (roundHistory: gc.RoundHistories.RoundHistory[]) => {
    return roundHistory.reduce((resultCount, { result }) => {
        Object.values(result).forEach((character: number) => {
            resultCount[character] = (resultCount[character] ?? 0) + 1;
        });
        return resultCount;
    }, {} as Record<number, number>);
};

/**
 * Calculates bet statistics from round histories
 */
export const calculateBetStatistics = (data: gc.RoundHistories.RoundHistory[]): BetCounts => {
    const initialCounts: BetCounts = {
        yellow: 0,
        red: 0,
        pink: 0,
        white: 0,
        blue: 0,
        green: 0
    };

    return data.reduce((counts, item) => {
        if (!item.settlementResult) return counts;

        const result = item.settlementResult as unknown as BetResult;
        return {
            yellow: counts.yellow + (result.yellow ? 1 : 0),
            red: counts.red + (result.red ? 1 : 0),
            pink: counts.pink + (result.pink ? 1 : 0),
            white: counts.white + (result.white ? 1 : 0),
            blue: counts.blue + (result.blue ? 1 : 0),
            green: counts.green + (result.green ? 1 : 0)
        };
    }, initialCounts);
}; 