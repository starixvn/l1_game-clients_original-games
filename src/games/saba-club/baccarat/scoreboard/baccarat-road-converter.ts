import { Converter } from "sc-scoreboards";
import { BaccaratSettlementResult } from "../type";
import { BigRoadScoreboard } from './types/scoreboard.types';
import { DEFAULT_PATTERNS } from './components/baccarat/big-road/BaccaratBigRoadPatterns';
import { getColumns, addEmptyPoints } from './components/baccarat/big-road/BigRoadHelper';

interface GridCell {
    status: boolean;  // true for Player, false for Banker
    isBlink?: boolean;
    ties?: number;
}

interface ConverterOptions {
    playerKey: string;
    tieKey: string;
}

class BaseRoadConverter<T, R> {
    constructor(protected readonly options: ConverterOptions) { }

    protected positiveKey(): string {
        return this.options.playerKey;
    }

    protected specialKey(): string {
        return this.options.tieKey;
    }

    convert(data: T): R {
        throw new Error('Not implemented');
    }
}

export class BaccaratRoadConverter extends BaseRoadConverter<BaccaratSettlementResult[], boolean> {
    private static defaultOptions: ConverterOptions = {
        playerKey: 'player',
        tieKey: 'tie'
    };

    static instance = new BaccaratRoadConverter(BaccaratRoadConverter.defaultOptions);

    private _bigRoad: BigRoadScoreboard<unknown>;
    private gridSettings = {
        row: 6,
        column: 10,
        maxColumns: 1000
    };

    private _grid: (GridCell | null)[][] = [];

    defaultPatterns = DEFAULT_PATTERNS;

    private columnLengthDetectorDetector = {
        patterns: this.defaultPatterns,
        updatePatterns: (patterns: any[]) => {
            this.defaultPatterns = patterns;
        }
    };

    constructor(options: ConverterOptions = BaccaratRoadConverter.defaultOptions) {
        super(options);
        this.createBigRoad();
    }

    private get bigRoad() {
        if (!this._bigRoad) {
            this.createBigRoad();
        }
        return this._bigRoad;
    }

    private createBigRoad() {
        this._bigRoad = new BigRoadScoreboard({
            converter: this,
            height: this.gridSettings.row,
            goodRoadDetectors: [this.columnLengthDetectorDetector],
        });
    }

    updatePatterns(patterns: any[]) {
        this.columnLengthDetectorDetector.updatePatterns(patterns);
    }

    private organizeDataForBigRoad(rounds: BaccaratSettlementResult[]): (GridCell | null)[][] {
        const grid: (GridCell | null)[][] = Array(this.gridSettings.row).fill(null)
            .map(() => Array(Math.max(this.gridSettings.maxColumns, rounds.length)).fill(null));

        let currentCol = 0;
        let currentRow = 0;
        let lastResult: boolean | null = null;
        let lastCol = -1;
        let tieCount = 0;

        const processRound = (round: BaccaratSettlementResult, index: number) => {
            if (round.tie) {
                tieCount++;
                return;
            }

            const isPlayer = round.player;
            const isMostRecent = index === 0;

            // First result
            if (lastResult === null) {
                grid[0][0] = {
                    status: isPlayer,
                    ties: tieCount,
                    isBlink: isMostRecent
                };
                lastResult = isPlayer;
                lastCol = 0;
                tieCount = 0;
                return;
            }

            // Same result as previous
            if (isPlayer === lastResult) {
                if (currentRow + 1 < this.gridSettings.row && grid[currentRow + 1][currentCol] === null) {
                    currentRow++;
                } else {
                    currentCol++;
                    currentRow = 0;
                    lastCol = currentCol;
                }
            }
            // Different result
            else {
                currentCol = lastCol + 1;
                currentRow = 0;
                while (currentRow < this.gridSettings.row && grid[currentRow][currentCol] !== null) {
                    currentRow++;
                }
                if (currentRow >= this.gridSettings.row) {
                    currentCol++;
                    currentRow = 0;
                }
                lastCol = currentCol;
            }

            grid[currentRow][currentCol] = {
                status: isPlayer,
                ties: tieCount,
                isBlink: isMostRecent
            };
            lastResult = isPlayer;
            tieCount = 0;
        };

        // Process rounds in reverse order to show most recent on the right
        [...rounds].reverse().forEach(processRound);

        // Find the last used column
        let lastUsedColumn = 0;
        for (let col = grid[0].length - 1; col >= 0; col--) {
            for (let row = 0; row < this.gridSettings.row; row++) {
                if (grid[row][col] !== null) {
                    lastUsedColumn = col;
                    break;
                }
            }
            if (lastUsedColumn !== 0) break;
        }

        return grid.map(row => row.slice(0, lastUsedColumn + 1));
    }

    apply(data: BaccaratSettlementResult[]) {
        this._grid = this.organizeDataForBigRoad(data);
        this.bigRoad.initialize(data);

        const points = getColumns(this.bigRoad);
        const maximumPoints = this.gridSettings.row * this.gridSettings.column;

        addEmptyPoints(points, maximumPoints);

        return points;
    }

    getGrid(): (GridCell | null)[][] {
        return this._grid;
    }

    getGoodRoad() {
        const goodRoad = this.bigRoad.getGoodRoad();
        if (Object.keys(goodRoad).length === 0) {
            return null;
        }

        if (goodRoad?.x === -1 || goodRoad?.width === 0) {
            return null;
        }
        return goodRoad;
    }

    static addBlinkNode(rounds: BaccaratSettlementResult[]) {
        const lastRound = rounds.find((round) => round.winner === 'player' || round.winner === 'banker');

        const blinkRound: BaccaratSettlementResult = {
            winner: lastRound?.winner || 'player',
            playerPair: false,
            bankerPair: false,
            player: false,
            banker: false,
            tie: false,
            big: false,
            small: false
        };

        rounds.unshift(blinkRound);
    }

    group(items: BaccaratSettlementResult[]): BaccaratSettlementResult[][] {
        const groups: BaccaratSettlementResult[][] = [];
        let currentGroup: BaccaratSettlementResult[] = [];

        for (const item of items) {
            if (currentGroup.length === 0 || currentGroup[0].winner === item.winner) {
                currentGroup.push(item);
            } else {
                groups.push(currentGroup);
                currentGroup = [item];
            }
        }

        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }

        return groups;
    }

    convert(group: BaccaratSettlementResult[]): boolean {
        if (group.length === 0) return false;
        const firstItem = group[0];
        return firstItem.winner === this.positiveKey();
    }
} 