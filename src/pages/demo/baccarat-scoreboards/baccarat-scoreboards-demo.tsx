import React from 'react';
import * as gc from "@sg/sg-game-client";
import styles from '../../../games/saba-club/baccarat/scoreboard/baccarat-scoreboards.module.scss';
import { BaccaratBetPercentages } from '../../../games/saba-club/baccarat/baccarat-bet-percentages';
import {
    DEFAULT_CONFIG,
    GridCell,
    organizeDataForBigRoad,
    getSettlementResult
} from '../../../games/saba-club/baccarat/scoreboard/baccarat-big-road-patterns';
import { RoundHistory } from '../../../games/saba-club/baccarat/baccarat-anim/constants';

// Demo data
const DEMO_ROUNDS: gc.RoundHistories.RoundHistory[] = RoundHistory.slice(0, 20);
interface Props {
    gameName?: string;
    maxRows?: number;
    noRender?: boolean;
}

export const BaccaratBigRoadDemo: React.FC<Props> = ({ noRender, gameName, maxRows = DEFAULT_CONFIG.maxRows }) => {
    const scrollDivRef = React.useRef<HTMLDivElement>(null);
    const [gridData, setGridData] = React.useState<(GridCell | null)[][]>([]);

    React.useEffect(() => {
        processRounds(DEMO_ROUNDS);
    }, [maxRows]);

    const scrollToRight = () => {
        if (scrollDivRef.current) {
            scrollDivRef.current.scrollLeft = scrollDivRef.current.scrollWidth;
        }
    };

    const getDotImage = (status: boolean, isBlink: boolean, hasPair: boolean = false): string => {
        const baseDir = '/static/images/baccarat/scoreboard/big-road';
        if (isBlink) {
            return `${baseDir}/Rectangle 9391.png`;
        }

        // Base filename (player or banker)
        let filename = status ? 'player' : 'banker';

        // Add pair modifier if needed
        if (hasPair) {
            filename += '-pair';
        }

        return `${baseDir}/${filename}.png`;
    };

    const getPairImage = (status: boolean): string => {
        const baseDir = '/static/images/baccarat/scoreboard/big-road';
        return `${baseDir}/${status ? 'player' : 'banker'}-pair.png`;
    };

    const getTieImage = (): string => {
        return '/static/images/baccarat/scoreboard/big-road/tie.png';
    };

    const processRounds = (rounds: gc.RoundHistories.RoundHistory[]) => {
        if (!rounds?.length) return;
        const data = organizeDataForBigRoad(rounds, maxRows, 'SETTLED', getSettlementResult);
        setGridData(data);
        setTimeout(scrollToRight, 100);
    };

    if (noRender || !DEMO_ROUNDS?.length) {
        return null;
    }

    const settlements = DEMO_ROUNDS.map(round => getSettlementResult(round.settlementResult));

    return (
        <div className={styles.scoreboard}>
            <div className={styles["scoreboard-title"]}>ScoreBoard Demo</div>
            <div style={{ width: '800px', margin: '20px 0', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px', lineHeight: '1.6' }}>
                <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#333' }}>How to Read the Scoreboard</h3>
                <p style={{ margin: '0', color: '#444' }}>
                    This board arranges the results in columns or streaks. Each filled column shows how many consecutive wins have happened for either banker or player.
                    The icons in this roadmap are shown as hollow circles. Bankers are in red, Players are in blue.
                </p>
                <p style={{ margin: '10px 0', color: '#444' }}>
                    Ties are NOT shown as a separate icon. Instead, they are shown as a green slash &quot;/&quot;, embedded inside the circle of the last round.
                    If there are more than 1 consecutive Ties, the number of Ties will be written on the &quot;Slash&quot;.
                </p>
                <p style={{ margin: '10px 0', color: '#444' }}>
                    Circles will have a yellow dot inside if the win was a &quot;natural&quot;. A &quot;natural&quot; is a hand that has a score of 9 or 8 with two cards.
                </p>
                <p style={{ margin: '0', color: '#444' }}>
                    &quot;Banker Pair&quot; is shown as a small red circle placed on the top left corner of the symbol.<br />
                    &quot;Player Pair&quot; is shown as a small blue circle placed on the bottom right of the symbol.
                </p>
            </div>
            <div className={styles["scoreboard-percentage"]} style={{ width: '800px' }}>
                <div className={styles["split-percentage"]}>
                    <BaccaratBetPercentages
                        gameName={gameName}
                        settlements={settlements}
                        rounds={DEMO_ROUNDS}
                    />
                </div>
            </div>
            <div className={`${styles["scoreboard-content"]} baccarat-big-road`}
                ref={scrollDivRef}
                style={{ width: '800px' }}
            >
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

                                const imagePath = getDotImage(
                                    cell.status,
                                    cell.isBlink,
                                    cell.hasPair
                                );

                                return (
                                    <div
                                        className={styles["dot-item"]}
                                        style={{
                                            gridColumnStart: colIndex + 1,
                                            gridRowStart: rowIndex + 1
                                        }}
                                        key={`${rowIndex}_${colIndex}`}
                                    >
                                        <div className={styles["dot-image"]} style={{ position: 'relative' }}>
                                            <img src={imagePath} alt={cell.status ? "Player" : "Banker"} style={{ position: 'relative', zIndex: 1 }} />
                                            {cell.hasPair && (
                                                <img
                                                    className={styles["pair-indicator"]}
                                                    src={getPairImage(cell.status)}
                                                    alt={`${cell.status ? "Player" : "Banker"} Pair`}
                                                    style={{
                                                        position: 'absolute',
                                                        top: cell.status ? 'auto' : '0',
                                                        bottom: cell.status ? '0' : 'auto',
                                                        right: cell.status ? '0' : 'auto',
                                                        left: cell.status ? 'auto' : '0',
                                                        zIndex: 2
                                                    }}
                                                />
                                            )}
                                            {cell.isNatural && (
                                                <img
                                                    className={styles["natural-indicator"]}
                                                    src="/static/images/baccarat/scoreboard/big-road/natural.png"
                                                    alt="Natural"
                                                    style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        zIndex: 2
                                                    }}
                                                />
                                            )}
                                            {cell.ties > 0 && (
                                                <>
                                                    {cell.ties >= 2 && (
                                                        <span className={styles["tie-count"]}>
                                                            {cell.ties}
                                                        </span>
                                                    )}
                                                    <img
                                                        className={styles["tie-image"]}
                                                        src={getTieImage()}
                                                        alt="Tie"
                                                        style={{ position: 'relative', zIndex: 3 }}
                                                    />
                                                </>
                                            )}
                                        </div>
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