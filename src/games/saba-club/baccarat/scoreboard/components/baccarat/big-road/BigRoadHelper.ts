import { BigRoadScoreboard } from '../../../types/scoreboard.types';

export interface BigRoadPoint<Raw> {
    x: number;
    y: number;
    status: boolean | undefined;
    data: Raw[];
    index: number;
    parentColumn: number;
}

export function rowToColumns<T>(rows: T[][]): T[] {
    const result: { [key: number]: { [key: number]: T } } = {};

    rows.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
            if (result[columnIndex]) {
                result[columnIndex][rowIndex] = cell;
            } else {
                result[columnIndex] = { [rowIndex]: cell };
            }
        });
    });

    return Object.values(result).flatMap((data) => Object.values(data));
}

export function getColumns<T>(bigRoad: BigRoadScoreboard<T>): BigRoadPoint<T>[] {
    const bigRoadData = bigRoad.rows();
    return rowToColumns(bigRoadData).map((data, index) => ({
        data: [data],
        x: Math.floor(index / 6),
        y: index % 6,
        status: undefined,
        index: index,
        parentColumn: -1
    }));
}

export function addEmptyPoints<T>(points: BigRoadPoint<T>[], maximum: number) {
    const additionPoints = maximum - points.length;

    for (let index = 0; index < additionPoints; index++) {
        points.push({
            data: [],
            x: 0,
            y: 3,
            status: undefined,
            index: -1,
            parentColumn: -1,
        });
    }
} 