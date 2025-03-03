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
    isDragonTail?: boolean;
    dragonTailOffset?: number; // Number of positions to the right in the dragon tail
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
    let lastWinningCell: { row: number; col: number } | null = null;
    let dragonTailStartCol = -1;
    let dragonTailLength = 0;
    let lastDragonTailEndCol = -1;

    const shouldBlink = ['LOCKING_BET', 'SHOW_ANIMATION_RESULT'].includes(roundState);

    // Find the next available position in the bottom row
    const findNextAvailablePosition = (startCol: number): number => {
        let col = startCol;
        while (grid[maxRows - 1][col] !== null) {
            col++;
        }
        return col;
    };

    const processRound = (round: gc.RoundHistories.RoundHistory, index: number) => {
        const result = getSettlementResult(round.settlementResult);

        if (result.tie) {
            if (lastWinningCell) {
                const { row, col } = lastWinningCell;
                if (grid[row][col]) {
                    grid[row][col]!.ties = (grid[row][col]!.ties || 0) + 1;
                }
            }
            return;
        }

        if (result.player || result.banker) {
            const currentResult = result.player;

            if (lastResult === null || lastResult === currentResult) {
                if (currentRow >= maxRows) {
                    // Start or continue dragon tail
                    if (dragonTailStartCol === -1) {
                        dragonTailStartCol = currentCol;
                        dragonTailLength = 0;
                    }

                    // Find the next available position for the dragon tail
                    const targetCol = findNextAvailablePosition(dragonTailStartCol);

                    grid[maxRows - 1][targetCol] = {
                        status: currentResult,
                        isBlink: shouldBlink && index === rounds.length - 1,
                        playerPair: result.playerPair,
                        bankerPair: result.bankerPair,
                        isNatural: result.natural,
                        roundId: round.roundId,
                        isDragonTail: true,
                        dragonTailOffset: dragonTailLength
                    };

                    dragonTailLength++;
                    lastWinningCell = { row: maxRows - 1, col: targetCol };
                    lastDragonTailEndCol = targetCol;
                } else {
                    // Normal vertical placement
                    grid[currentRow][currentCol] = {
                        status: currentResult,
                        isBlink: shouldBlink && index === rounds.length - 1,
                        playerPair: result.playerPair,
                        bankerPair: result.bankerPair,
                        isNatural: result.natural,
                        roundId: round.roundId
                    };
                    lastWinningCell = { row: currentRow, col: currentCol };
                    currentRow++;
                }
            } else {
                // Start new column
                currentRow = 0;
                currentCol++;
                dragonTailStartCol = -1;
                dragonTailLength = 0;

                grid[currentRow][currentCol] = {
                    status: currentResult,
                    isBlink: shouldBlink && index === rounds.length - 1,
                    playerPair: result.playerPair,
                    bankerPair: result.bankerPair,
                    isNatural: result.natural,
                    roundId: round.roundId
                };
                lastWinningCell = { row: currentRow, col: currentCol };
                currentRow++;
            }

            lastResult = currentResult;
        }
    };

    // Process rounds in reverse order to show most recent on the right
    [...rounds].reverse().forEach(processRound);

    // Find the last used column including dragon tails
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

export const generateTestRounds = (): gc.RoundHistories.RoundHistory[] => {
    // Helper function to create a settlement result
    const createSettlement = (
        player: boolean,
        banker: boolean,
        tie: boolean = false,
        natural: boolean = false,
        playerPair: boolean = false,
        bankerPair: boolean = false
    ): gc.GameServiceMessage.TSettlementResult => ({
        player,
        banker,
        tie,
        natural,
        playerPair,
        bankerPair,
        gameData: {
            player,
            banker,
            tie,
            natural,
            playerPair,
            bankerPair
        } as any
    });

    // Create a sequence that will demonstrate dragon tails
    // We'll create a sequence where:
    // 1. First column fills up with 6 player wins
    // 2. Then continues with 3 more player wins (creating a dragon tail)
    // 3. Then switches to banker wins
    const testRounds: gc.RoundHistories.RoundHistory[] = [];
    let roundId = 1;

    // Helper function to create a round
    const createRound = (
        roundId: number,
        settlementResult: gc.GameServiceMessage.TSettlementResult
    ): gc.RoundHistories.RoundHistory => ({
        roundId,
        settlementResult,
        result: settlementResult.player ? 'player' : settlementResult.banker ? 'banker' : 'tie' as any
    });

    // First column - 6 player wins (fills the column)
    for (let i = 0; i < 6; i++) {
        testRounds.push(createRound(roundId++, createSettlement(true, false)));
    }

    // Dragon tail - 3 more player wins
    for (let i = 0; i < 3; i++) {
        testRounds.push(createRound(roundId++, createSettlement(true, false)));
    }

    // Switch to banker wins
    for (let i = 0; i < 4; i++) {
        testRounds.push(createRound(roundId++, createSettlement(false, true)));
    }

    // Add some ties and pairs for variety
    testRounds.push(createRound(roundId++, createSettlement(false, false, true)));
    testRounds.push(createRound(roundId++, createSettlement(true, false, false, true, true)));

    return testRounds;
};

// Example usage function
export const testBigRoadWithDragonTails = (): (GridCell | null)[][] => {
    const testRounds = generateTestRounds();
    return organizeDataForBigRoad(testRounds, DEFAULT_CONFIG.maxRows, 'SETTLED', getSettlementResult);
}; 