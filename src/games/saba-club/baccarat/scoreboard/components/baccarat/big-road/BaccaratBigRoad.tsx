import React, { useEffect, useState, useRef } from 'react';
import { ScoreboardBigRoadAlgorithm } from './BaccaratBigRoadAlgorithm';
import { GridLayout } from '../../shared/GridLayout';
import { ScoreboardGridItem } from '../../shared/ScoreboardGridItem';
import { ColumnLengthPattern, ScScoreboards } from '../../../types/scoreboard.types';
import styles from './BaccaratBigRoad.module.scss';

interface BaccaratBigRoadProps {
    rounds: unknown[];
    noRender?: boolean;
    gameName?: string;
}

interface GridCell {
    result: 'player' | 'banker';
    ties: number;
    round: any;
}

export const BaccaratBigRoad: React.FC<BaccaratBigRoadProps> = ({
    rounds,
    noRender = false,
    gameName
}) => {
    const [gridData, setGridData] = useState<(GridCell | null)[][]>([]);
    const [cached, setCached] = useState<unknown[] | null>(null);
    const scrollDivRef = useRef<HTMLDivElement>(null);
    const algorithm = new ScoreboardBigRoadAlgorithm();

    const processRounds = (rounds: unknown[]) => {
        if (!rounds || rounds.length === 0) return;

        setCached(rounds);
        const converted = algorithm.converter.convert(rounds);
        const data = algorithm.apply(converted);

        const organizedData = organizeDataForBigRoad([...rounds].reverse());
        setGridData(organizedData);

    };

    const organizeDataForBigRoad = (rounds: any[]) => {
        const ROWS = 6;
        const COLS = 30;
        // Initialize grid with null values
        const grid: (GridCell | null)[][] = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
        let currentCol = 0;
        let currentRow = 0;
        let lastResult: 'player' | 'banker' | null = null;
        let lastCol = 0;
        let tieCount = 0;
        let maxColumn = 0;

        const addToGrid = (round: any, result: 'player' | 'banker') => {
            grid[currentRow][currentCol] = {
                result,
                ties: tieCount,
                round
            };
            maxColumn = Math.max(maxColumn, currentCol);
            tieCount = 0;
        };

        const findNextPosition = (result: 'player' | 'banker') => {
            if (lastResult !== result) {
                // Different result - find first available row in next column
                currentCol = lastCol + 1;
                currentRow = 0;
                // Find first empty row in this column
                while (currentRow < ROWS && grid[currentRow][currentCol] !== null) {
                    currentRow++;
                }
                // If no empty row found, start new column
                if (currentRow >= ROWS) {
                    currentCol++;
                    currentRow = 0;
                }
                lastCol = currentCol;
            } else {
                // Same result - try to stack vertically
                if (currentRow + 1 < ROWS && grid[currentRow + 1][currentCol] === null) {
                    // Can stack vertically
                    currentRow++;
                } else {
                    // Need to start a new column
                    currentCol = lastCol + 1;
                    currentRow = 0;
                    lastCol = currentCol;
                }
            }
        };

        rounds.forEach((round) => {
            const result = round.settlementResult;

            if (result.tie) {
                tieCount++;
                return;
            }

            const currentResult = result.player ? 'player' : 'banker';

            if (lastResult === null) {
                // First result
                addToGrid(round, currentResult);
            } else {
                findNextPosition(currentResult);
                addToGrid(round, currentResult);
            }

            lastResult = currentResult;
        });

        // Return all rows with consistent columns
        return grid.map(row => row.slice(0, maxColumn + 1));
    };

    useEffect(() => {
        if (rounds && rounds.length > 0) {
            processRounds(rounds);
        }
    }, [rounds]);

    useEffect(() => {
        if (scrollDivRef.current) {
            scrollDivRef.current.scrollLeft = scrollDivRef.current.scrollWidth;
        }
    }, [gridData]);

    if (noRender) {
        return null;
    }

    return (
        <div className={styles.scoreboard}>
            <div className={styles["scoreboard-title"]}>Big Road</div>
            <div className={styles["scoreboard-percentage"]}>
                <div className={styles["split-percentage"]}>
                    {/* Percentage component can be added here if needed */}
                </div>
            </div>
            <div className={`${styles["scoreboard-content"]} baccarat-big-road`} ref={scrollDivRef}>
                <div className={styles['grid-container']}>
                    {gridData.map((row, rowIndex) => (
                        <div key={rowIndex} className={styles['grid-row']}>
                            {row.map((cell, colIndex) => (
                                <ScoreboardGridItem
                                    key={`${rowIndex}-${colIndex}`}
                                    data={cell ? [cell.round] : []}
                                    x={colIndex}
                                    y={rowIndex}
                                    ties={cell?.ties || 0}
                                    result={cell?.result}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}; 