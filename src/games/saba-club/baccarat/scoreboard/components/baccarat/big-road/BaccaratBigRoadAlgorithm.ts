import { BigRoadScoreboard } from '../../../types/scoreboard.types';
import { DEFAULT_PATTERNS } from './BaccaratBigRoadPatterns';
import { getColumns, addEmptyPoints } from './BigRoadHelper';

interface ConverterOptions {
    keyOfA: string;
    tieKey: string;
}

class BigRoadConverter {
    constructor(protected readonly options: ConverterOptions) { }

    protected positiveKey() {
        return this.options.keyOfA;
    }

    protected specialKey(): string {
        return this.options.tieKey;
    }

    convert(data: unknown[]) {
        // Implement conversion logic here
        return data;
    }
}

export class ScoreboardBigRoadAlgorithm {
    public converter: BigRoadConverter;
    private _bigRoad: BigRoadScoreboard<unknown>;
    private gridSettings = {
        row: 6,
        column: 10
    };

    defaultPatterns = DEFAULT_PATTERNS;

    private columnLengthDetectorDetector = {
        patterns: this.defaultPatterns,
        updatePatterns: (patterns: any[]) => {
            this.defaultPatterns = patterns;
        }
    };

    constructor() {
        this.converter = new BigRoadConverter({
            keyOfA: 'A',
            tieKey: 'tie'
        });
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
            converter: this.converter,
            height: this.gridSettings.row,
            goodRoadDetectors: [this.columnLengthDetectorDetector],
        });
    }

    updatePatterns(patterns: any[]) {
        this.columnLengthDetectorDetector.updatePatterns(patterns);
    }

    apply(data: unknown[]) {
        this.bigRoad.initialize(data);

        const points = getColumns(this.bigRoad);
        const maximumPoints = this.gridSettings.row * this.gridSettings.column;

        addEmptyPoints(points, maximumPoints);

        return points;
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
} 