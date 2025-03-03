import { ColumnLengthPattern } from './types/scoreboard.types';
import * as gc from "@sg/sg-game-client";

export interface GridCell {
    status: boolean;  // true for Player, false for Banker
    isBlink?: boolean;
    ties?: number;
    hasPair?: boolean;
    isNatural?: boolean;
}

export interface BaccaratSettlementResult {
    winner: string;
    playerPair: boolean;
    bankerPair: boolean;
    player: boolean;
    banker: boolean;
    tie: boolean;
    big: boolean;
    small: boolean;
    natural: boolean;
}

export const DEFAULT_CONFIG = {
    maxColumns: 1000,
    maxRows: 6,
    character: {
        positiveItemContent: 'P',
        negativeItemContent: 'B'
    },
    dotClassName: {
        positiveItemContent: 'player-dot',
        negativeItemContent: 'banker-dot'
    }
};

export const DEFAULT_PATTERNS: ColumnLengthPattern[] = [
    { id: 'pattern1', pattern: [1, 2, 3] },
    { id: 'pattern2', pattern: [2, 3, 4] },
    { id: 'pattern3', pattern: [3, 4, 5] }
];

export const organizeDataForBigRoad = (
    rounds: gc.RoundHistories.RoundHistory[],
    maxRows: number,
    roundState: string,
    getSettlementResult: (settlementResult: gc.GameServiceMessage.TSettlementResult) => BaccaratSettlementResult
): (GridCell | null)[][] => {
    const grid: (GridCell | null)[][] = Array(maxRows).fill(null)
        .map(() => Array(Math.max(DEFAULT_CONFIG.maxColumns, rounds.length)).fill(null));

    let currentCol = 0;
    let currentRow = 0;
    let lastResult: boolean | null = null;
    let tieCount = 0;

    const shouldBlink = ['LOCKING_BET', 'SHOW_ANIMATION_RESULT'].includes(roundState);

    const processRound = (round: gc.RoundHistories.RoundHistory, index: number) => {
        const result = getSettlementResult(round.settlementResult);

        if (result.tie) {
            tieCount++;
            return;
        }

        const isPlayer = result.player;
        const isMostRecent = index === 0;
        const hasPair = isPlayer ? result.playerPair : result.bankerPair;

        // First result
        if (lastResult === null) {
            grid[0][0] = {
                status: isPlayer,
                ties: tieCount,
                isBlink: isMostRecent && shouldBlink,
                hasPair,
                isNatural: result.natural
            };
            lastResult = isPlayer;
            tieCount = 0;
            return;
        }

        // Same result as previous
        if (isPlayer === lastResult) {
            // Try to stack vertically in the same column
            if (currentRow + 1 < maxRows) {
                currentRow++;
            } else {
                // If column is full, start a new column
                currentCol++;
                currentRow = 0;
            }
        } else {
            // Different result, start a new column
            currentCol++;
            currentRow = 0;
        }

        grid[currentRow][currentCol] = {
            status: isPlayer,
            ties: tieCount,
            isBlink: isMostRecent && shouldBlink,
            hasPair,
            isNatural: result.natural
        };
        lastResult = isPlayer;
        tieCount = 0;
    };

    // Process rounds in reverse order to show most recent on the right
    [...rounds].reverse().forEach(processRound);

    // Find the last used column
    let lastUsedColumn = 0;
    for (let col = grid[0].length - 1; col >= 0; col--) {
        for (let row = 0; row < maxRows; row++) {
            if (grid[row][col] !== null) {
                lastUsedColumn = col;
                break;
            }
        }
        if (lastUsedColumn !== 0) break;
    }

    return grid.map(row => row.slice(0, lastUsedColumn + 1));
};

export const getSettlementResult = (settlementResult: gc.GameServiceMessage.TSettlementResult): BaccaratSettlementResult => {
    const result: BaccaratSettlementResult = {
        winner: 'player',
        playerPair: false,
        bankerPair: false,
        player: false,
        banker: false,
        tie: false,
        big: false,
        small: false,
        natural: false
    };

    if (settlementResult && typeof settlementResult === "object") {
        result.player = !!settlementResult.player;
        result.banker = !!settlementResult.banker;
        result.tie = !!settlementResult.tie;
        result.natural = !!settlementResult.natural;

        if (settlementResult.player) {
            result.winner = 'player';
        } else if (settlementResult.banker) {
            result.winner = 'banker';
        } else if (settlementResult.tie) {
            result.winner = 'tie';
        }

        const gameData = settlementResult.gameData;
        if (gameData && typeof gameData === "object") {
            const data = gameData as Record<string, unknown>;
            result.playerPair = !!data.playerPair;
            result.bankerPair = !!data.bankerPair;
            result.big = !!data.big;
            result.small = !!data.small;
            if (!result.natural) {
                result.natural = !!data.natural || !!data.isNatural;
            }
        }
    }

    return result;
}; 