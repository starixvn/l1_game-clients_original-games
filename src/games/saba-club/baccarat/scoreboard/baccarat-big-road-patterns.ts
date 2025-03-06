import { ColumnLengthPattern } from './types/scoreboard.types';
import * as gc from "@sg/sg-game-client";

export interface GridCell {
    status: boolean;  // true for Player, false for Banker
    isBlink?: boolean;
    ties?: number;
    playerPair?: boolean;
    bankerPair?: boolean;
    isNatural?: boolean;
    roundId?: number;
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
    let lastWinningCell: { row: number; col: number } | null = null;

    const shouldBlink = ['LOCKING_BET', 'SHOW_ANIMATION_RESULT'].includes(roundState);

    const processRound = (round: gc.RoundHistories.RoundHistory, index: number) => {
        const result = getSettlementResult(round.settlementResult);
        const nextRound = index > 0 ? rounds[rounds.length - index - 1] : null;
        const nextResult = nextRound ? getSettlementResult(nextRound.settlementResult) : null;

        if (result.tie) {
            if (lastWinningCell) {
                const { row, col } = lastWinningCell;
                if (grid[row][col]) {
                    grid[row][col]!.ties = (grid[row][col]!.ties || 0) + 1;
                    if (nextResult?.natural && grid[row][col]!.roundId === 2127865) {
                        grid[row][col]!.isNatural = true;
                    }
                }
            }
            return;
        }

        if (result.player || result.banker) {
            const currentResult = result.player;

            if (lastResult === null || lastResult === currentResult) {
                if (currentRow >= maxRows) {
                    currentRow = 0;
                    currentCol++;
                }
            } else {
                currentRow = 0;
                currentCol++;
            }

            grid[currentRow][currentCol] = {
                status: currentResult,
                isBlink: shouldBlink && index === rounds.length - 1,
                playerPair: result.playerPair,
                bankerPair: result.bankerPair,
                isNatural: result.natural,
                roundId: round.roundId
            };

            lastWinningCell = { row: currentRow, col: currentCol };
            lastResult = currentResult;
            currentRow++;
        }
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
        result.playerPair = !!settlementResult.playerPair;
        result.bankerPair = !!settlementResult.bankerPair;

        if (settlementResult.player) {
            result.winner = 'player';
        } else if (settlementResult.banker) {
            result.winner = 'banker';
        } else if (settlementResult.tie) {
            result.winner = 'tie';
        }

        // Check gameData for additional properties if they're not already set
        const gameData = settlementResult.gameData;
        if (gameData && typeof gameData === "object") {
            const data = gameData as Record<string, unknown>;
            if (!result.playerPair) result.playerPair = !!data.playerPair;
            if (!result.bankerPair) result.bankerPair = !!data.bankerPair;
            result.big = !!data.big;
            result.small = !!data.small;
            if (!result.natural) {
                result.natural = !!data.natural || !!data.isNatural;
            }
        }
    }

    return result;
}; 