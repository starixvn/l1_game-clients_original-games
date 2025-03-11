import { Converter } from "sc-scoreboards";
import { BaccaratSettlementResult, BaccaratWinner } from "../../type";

interface BigRoadCell {
    winner: BaccaratWinner;
    playerPair: boolean;
    bankerPair: boolean;
    natural: boolean;
    tie: number;
    roundId?: number;
    isBlink?: boolean;
}

export class BaccaratRoadConverter extends Converter<BaccaratSettlementResult> {
    static addBlinkNode(rounds: BaccaratSettlementResult[]) {
        const lastRound = rounds.find((round) => round.winner === 'player' || round.winner === 'banker');

        const blinkRound: BaccaratSettlementResult = {
            winner: lastRound?.winner || 'player',
            playerPair: false,
            bankerPair: false,
            player: lastRound?.winner === 'player' || false,
            banker: lastRound?.winner === 'banker' || false,
            tie: false,
            natural: false
        };

        rounds.unshift(blinkRound);
    }

    static instance = new BaccaratRoadConverter();

    protected positiveKey(): string {
        return 'player';
    }

    protected specialKey(): string {
        return 'tie';
    }

    private findNextPosition(grid: BigRoadCell[][], lastCol: number, lastRow: number, currentWinner: BaccaratWinner): { col: number, row: number } {
        // If it's the first entry
        if (lastCol === -1) {
            return { col: 0, row: 0 };
        }

        // Get the winner of the last position
        const lastWinner = grid[lastRow][lastCol].winner;

        // If same winner, try to stack vertically
        if (lastWinner === currentWinner) {
            // Check if we can stack vertically
            let nextRow = lastRow + 1;

            // If we can stack vertically in the same column (max 6 rows)
            if (nextRow < 6 && !grid[nextRow][lastCol]) {
                return { col: lastCol, row: nextRow };
            }

            // If we hit the row limit or position is occupied, start new column
            return { col: lastCol + 1, row: 0 };
        }

        // Different winner, start new column
        return { col: lastCol + 1, row: 0 };
    }

    private organizeBigRoad(items: BaccaratSettlementResult[]): BigRoadCell[][] {
        const grid: BigRoadCell[][] = Array(6).fill(null).map(() => []);
        let lastCol = -1;
        let lastRow = -1;
        let lastCell: BigRoadCell | null = null;
        let roundId = items.length; // Start from the end since we process in reverse

        items.forEach((item, index) => {
            if (item.tie) {
                if (lastCell) {
                    lastCell.tie = (lastCell.tie || 0) + 1;
                }
                return;
            }

            const winner = item.player ? 'player' : 'banker';
            const { col, row } = this.findNextPosition(grid, lastCol, lastRow, winner);

            const cell: BigRoadCell = {
                winner,
                playerPair: item.playerPair,
                bankerPair: item.bankerPair,
                natural: item.natural,
                tie: 0,
                roundId: roundId - index,
                isBlink: index === 0 // Only the most recent entry should blink
            };

            grid[row][col] = cell;
            lastCell = cell;
            lastCol = col;
            lastRow = row;
        });

        return grid;
    }

    group(items: BaccaratSettlementResult[]): BaccaratSettlementResult[][] {
        const grid = this.organizeBigRoad(items);
        const groups: BaccaratSettlementResult[][] = [];

        // Find the last used column
        let maxCol = 0;
        for (let col = 0; col < grid[0].length; col++) {
            if (grid.some(row => row[col])) {
                maxCol = col;
            }
        }

        // Convert grid back to groups
        for (let col = 0; col <= maxCol; col++) {
            const colGroup: BaccaratSettlementResult[] = [];
            for (let row = 0; row < 6; row++) {
                const cell = grid[row][col];
                if (cell) {
                    const result: BaccaratSettlementResult = {
                        winner: cell.winner,
                        player: cell.winner === 'player',
                        banker: cell.winner === 'banker',
                        tie: false,
                        playerPair: cell.playerPair,
                        bankerPair: cell.bankerPair,
                        natural: cell.natural,
                        isBlink: cell.isBlink
                    };
                    colGroup.push(result);
                }
            }
            if (colGroup.length > 0) {
                groups.push(colGroup);
            }
        }

        return groups;
    }

    convert(group: BaccaratSettlementResult[]): boolean {
        if (group.length === 0) return false;
        const firstItem = group[0];
        return firstItem.player || firstItem.winner === 'player';
    }
} 