export interface ColumnLengthPattern {
    id: string;
    pattern: number[];
}


export namespace ScScoreboards {
    export interface GoodRoad {
        x: number;
        width: number;
        pattern?: ColumnLengthPattern;
    }
}

export class BigRoadScoreboard<T> {
    constructor(private config: {
        converter: any;
        height: number;
        goodRoadDetectors: any[];
    }) { }

    rows(): T[][] {
        // Implement rows logic
        return [];
    }

    initialize(data: T[]): void {
        // Implement initialization logic
    }
}

