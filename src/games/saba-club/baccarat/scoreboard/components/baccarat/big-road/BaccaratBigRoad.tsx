import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ScoreboardBigRoadAlgorithm } from './BaccaratBigRoadAlgorithm';
import styles from './BaccaratBigRoad.module.scss';
import { BaccaratBetPercentages } from '../../../../baccarat-bet-percentages';
import { BaccaratSettlementResult } from '../../../../type';
import * as gc from "@sg/sg-game-client";

interface BaccaratBigRoadProps {
    rounds: gc.RoundHistories.RoundHistory[];
    noRender?: boolean;
    gameName?: string;
    maxColumns?: number;
    maxRows?: number;
}

interface GridCell {
    status: boolean;  // true for Player, false for Banker
    isBlink?: boolean;
    ties?: number;
}

const DEFAULT_CONFIG = {
    maxColumns: 30,
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

export const BaccaratBigRoad: React.FC<BaccaratBigRoadProps> = ({
    rounds,
    noRender = false,
    gameName,
    maxColumns = DEFAULT_CONFIG.maxColumns,
    maxRows = DEFAULT_CONFIG.maxRows
}) => {
    const [gridData, setGridData] = useState<(GridCell | null)[][]>([]);
    const scrollDivRef = useRef<HTMLDivElement>(null);
    const algorithm = new ScoreboardBigRoadAlgorithm();

    const getDotClass = useCallback((status: boolean) => {
        const { positiveItemContent, negativeItemContent } = DEFAULT_CONFIG.dotClassName;
        return status ? styles[positiveItemContent] : styles[negativeItemContent];
    }, []);

    const getCharacter = useCallback((status: boolean) => {
        const { positiveItemContent, negativeItemContent } = DEFAULT_CONFIG.character;
        return status ? positiveItemContent : negativeItemContent;
    }, []);

    const processRounds = useCallback((rounds: unknown[]) => {
        if (!rounds?.length) return;

        const converted = algorithm.converter.convert(rounds);
        const data = algorithm.apply(converted);
        setGridData(organizeDataForBigRoad([...rounds].reverse()));
    }, []);

    const organizeDataForBigRoad = useCallback((rounds: any[]) => {
        const grid: (GridCell | null)[][] = Array(maxRows).fill(null)
            .map(() => Array(maxColumns).fill(null));

        let currentCol = 0;
        let currentRow = 0;
        let lastResult: boolean | null = null;
        let lastCol = 0;
        let tieCount = 0;
        let maxColumn = 0;

        const addToGrid = (round: any, isPlayer: boolean) => {
            if (currentCol >= maxColumns) return;

            grid[currentRow][currentCol] = {
                status: isPlayer,
                ties: tieCount,
                isBlink: round.isBlink
            };
            maxColumn = Math.max(maxColumn, currentCol);
            tieCount = 0;
        };

        const findNextPosition = (isPlayer: boolean) => {
            if (lastResult !== isPlayer) {
                currentCol = lastCol + 1;
                currentRow = 0;
                while (currentRow < maxRows && grid[currentRow][currentCol] !== null) {
                    currentRow++;
                }
                if (currentRow >= maxRows) {
                    currentCol++;
                    currentRow = 0;
                }
                lastCol = currentCol;
            } else {
                if (currentRow + 1 < maxRows && grid[currentRow + 1][currentCol] === null) {
                    currentRow++;
                } else {
                    currentCol = lastCol + 1;
                    currentRow = 0;
                    lastCol = currentCol;
                }
            }
        };

        rounds.forEach((round) => {
            if (currentCol >= maxColumns) return;

            const result = round.settlementResult;
            if (result.tie) {
                tieCount++;
                return;
            }

            const isPlayer = result.player;
            if (lastResult === null) {
                addToGrid(round, isPlayer);
            } else {
                findNextPosition(isPlayer);
                addToGrid(round, isPlayer);
            }
            lastResult = isPlayer;
        });

        return grid.map(row => row.slice(0, maxColumn + 1));
    }, [maxColumns, maxRows]);

    useEffect(() => {
        if (rounds?.length) {
            processRounds(rounds);
        }
    }, [rounds, processRounds]);

    useEffect(() => {
        if (scrollDivRef.current) {
            scrollDivRef.current.scrollLeft = scrollDivRef.current.scrollWidth;
        }
    }, [gridData]);

    const getSettlementResult = (settlementResult: gc.GameServiceMessage.TSettlementResult): BaccaratSettlementResult => {
        const result: BaccaratSettlementResult = {
            winner: 'player',
            playerPair: false,
            bankerPair: false,
            player: false,
            banker: false,
            tie: false,
            big: false,
            small: false
        };

        if (settlementResult && typeof settlementResult === "object") {
            result.player = !!settlementResult.player;
            result.banker = !!settlementResult.banker;
            result.tie = !!settlementResult.tie;

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
            }
        }

        return result;
    };

    const settlements = rounds.map(round => getSettlementResult(round.settlementResult));

    if (noRender) {
        return null;
    }

    return (
        <div className={styles.scoreboard}>
            <div className={styles["scoreboard-title"]}>Big Road</div>
            <div className={styles["scoreboard-percentage"]}>
                <div className={styles["split-percentage"]}>
                    <BaccaratBetPercentages
                        gameName={gameName}
                        settlements={settlements}
                        rounds={rounds}
                    />
                </div>
            </div>
            <div className={`${styles["scoreboard-content"]} baccarat-big-road`} ref={scrollDivRef}>
                <div
                    className={styles['grid-container']}
                    style={{
                        gridTemplateRows: `repeat(${maxRows}, var(--cell-size))`,
                        gridAutoColumns: 'var(--cell-size)'
                    }}
                >
                    {gridData.map((row, rowIndex) => (
                        <React.Fragment key={rowIndex}>
                            {row.map((cell, colIndex) => {
                                if (!cell) {
                                    return (
                                        <div
                                            className={styles["dot-item"]}
                                            key={`${rowIndex}_${colIndex}`}
                                            style={{
                                                gridColumnStart: colIndex + 1,
                                                gridRowStart: rowIndex + 1
                                            }}
                                        />
                                    );
                                }

                                return (
                                    <div
                                        className={styles["dot-item"]}
                                        style={{
                                            gridColumnStart: colIndex + 1,
                                            gridRowStart: rowIndex + 1
                                        }}
                                        key={`${rowIndex}_${colIndex}`}
                                    >
                                        {cell.isBlink ? (
                                            <div className={styles["dot-blink"]} />
                                        ) : (
                                            <div className={getDotClass(cell.status)}>
                                                {getCharacter(cell.status)}
                                                {cell.ties > 0 && (
                                                    <span className={styles["tie-count"]}>
                                                        {cell.ties}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}; 