import React from 'react';
import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../../../../_shared/components/observer-component/observer-component";
import { ScoreboardBigRoadAlgorithm } from './BaccaratBigRoadAlgorithm';
import styles from './BaccaratBigRoad.module.scss';
import { BaccaratBetPercentages } from '../../../../baccarat-bet-percentages';
import { BaccaratSettlementResult } from '../../../../type';
import { ROUND_STATE } from "@sg/sg-game-client/dist/game/rounds";
import { testRounds } from '../../../test';

interface GridCell {
    status: boolean;  // true for Player, false for Banker
    isBlink?: boolean;
    ties?: number;
}

interface IBaccaratBigRoadState extends IStateObserver {
    gridData: (GridCell | null)[][];
    rounds: gc.RoundHistories.RoundHistory[];
    roundState: string;
}

interface Props extends IPropsObserver {
    gameName?: string;
    maxColumns?: number;
    maxRows?: number;
    noRender?: boolean;
}

const DEFAULT_CONFIG = {
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

export class BaccaratBigRoad extends ObserverComponent<Props, IBaccaratBigRoadState> {
    private scrollDivRef = React.createRef<HTMLDivElement>();
    private algorithm = new ScoreboardBigRoadAlgorithm();

    constructor(props: Props) {
        super(props);
        this.state = {
            gridData: [],
            rounds: [],
            roundState: '',
            dispose: () => { /* cleanup logic if needed */ }
        };
        this.scrollDivRef = React.createRef();
    }

    componentDidUpdate(prevProps: Props, prevState: IBaccaratBigRoadState) {
        if (prevState.rounds !== this.state.rounds) {
            this.processRounds(this.state.rounds);
            this.scrollToRight();
        }
    }

    scrollToRight = () => {
        if (this.scrollDivRef.current) {
            this.scrollDivRef.current.scrollLeft = this.scrollDivRef.current.scrollWidth;
        }
    };

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(rounds: gc.RoundHistories.RoundHistory[]) {
        this.setState({ rounds });
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundState)
    renderCountDownTimerState(roundState: string) {
        this.setState({ roundState });
    }

    private getDotClass = (status: boolean): string => {
        const { positiveItemContent, negativeItemContent } = DEFAULT_CONFIG.dotClassName;
        return status ? styles[positiveItemContent] : styles[negativeItemContent];
    };

    private getCharacter = (status: boolean): string => {
        const { positiveItemContent, negativeItemContent } = DEFAULT_CONFIG.character;
        return status ? positiveItemContent : negativeItemContent;
    };

    private organizeDataForBigRoad = (rounds: gc.RoundHistories.RoundHistory[]): (GridCell | null)[][] => {
        const maxRows = this.props.maxRows || DEFAULT_CONFIG.maxRows;
        const grid: (GridCell | null)[][] = Array(maxRows).fill(null)
            .map(() => Array(Math.max(DEFAULT_CONFIG.maxColumns, rounds.length)).fill(null));

        let currentCol = 0;
        let currentRow = 0;
        let lastResult: boolean | null = null;
        let lastCol = -1;
        let tieCount = 0;

        const processRound = (round: gc.RoundHistories.RoundHistory) => {
            const result = this.getSettlementResult(round.settlementResult);

            if (result.tie) {
                tieCount++;
                return;
            }

            const isPlayer = result.player;

            // First result
            if (lastResult === null) {
                grid[0][0] = {
                    status: isPlayer,
                    ties: tieCount,
                    isBlink: this.state.roundState === ROUND_STATE.LOCKING_BET ||
                        this.state.roundState === ROUND_STATE.SHOW_ANIMATION_RESULT
                };
                lastResult = isPlayer;
                lastCol = 0;
                tieCount = 0;
                return;
            }

            // Same result as previous
            if (isPlayer === lastResult) {
                if (currentRow + 1 < maxRows && grid[currentRow + 1][currentCol] === null) {
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
                while (currentRow < maxRows && grid[currentRow][currentCol] !== null) {
                    currentRow++;
                }
                if (currentRow >= maxRows) {
                    currentCol++;
                    currentRow = 0;
                }
                lastCol = currentCol;
            }

            grid[currentRow][currentCol] = {
                status: isPlayer,
                ties: tieCount,
                isBlink: this.state.roundState === ROUND_STATE.LOCKING_BET ||
                    this.state.roundState === ROUND_STATE.SHOW_ANIMATION_RESULT
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

        // Return all columns up to the last used one
        return grid.map(row => row.slice(0, lastUsedColumn + 1));
    };

    private processRounds = (rounds: gc.RoundHistories.RoundHistory[]) => {
        if (!rounds?.length) return;
        const gridData = this.organizeDataForBigRoad(rounds);
        this.setState({ gridData });
    };

    private getSettlementResult = (settlementResult: gc.GameServiceMessage.TSettlementResult): BaccaratSettlementResult => {
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

    render() {
        const { noRender, gameName, maxRows = DEFAULT_CONFIG.maxRows } = this.props;
        const { gridData, rounds } = this.state;

        if (noRender || !rounds?.length) {
            return null;
        }

        const settlements = rounds.map(round => this.getSettlementResult(round.settlementResult));

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
                <div className={`${styles["scoreboard-content"]} baccarat-big-road`} ref={this.scrollDivRef}>
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
                                                <div className={this.getDotClass(cell.status)}>
                                                    {this.getCharacter(cell.status)}
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
    }
} 