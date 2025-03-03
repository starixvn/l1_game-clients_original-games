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
const DEMO_ROUNDS: gc.RoundHistories.RoundHistory[] = RoundHistory.slice(0, 50);
interface Props {
    gameName?: string;
    maxRows?: number;
    noRender?: boolean;
}

export const BaccaratBigRoadDemo: React.FC<Props> = ({ noRender, gameName, maxRows = DEFAULT_CONFIG.maxRows }) => {
    const scrollDivRef = React.useRef<HTMLDivElement>(null);
    const [gridData, setGridData] = React.useState<(GridCell | null)[][]>([]);
    // Add development mode flag
    const isDevelopment = process.env.NODE_ENV === 'development';

    React.useEffect(() => {
        processRounds(DEMO_ROUNDS);
        // Log for debugging
        if (isDevelopment) {
            console.log('Development mode enabled - background image should be visible');
        }
    }, [maxRows]);

    const scrollToRight = () => {
        if (scrollDivRef.current) {
            scrollDivRef.current.scrollLeft = scrollDivRef.current.scrollWidth;
        }
    };

    const getDotImage = (cell: GridCell): string => {
        if (cell.isBlink) {
            return '/static/images/baccarat/scoreboard/big-road/Rectangle 9391.png';
        }

        // Regular player or banker win (base circle)
        return `/static/images/baccarat/scoreboard/big-road/${cell.status ? 'player' : 'banker'}.png`;
    };

    const getPairDotImage = (cell: GridCell): string | null => {
        if (cell.hasPair) {
            return `/static/images/baccarat/scoreboard/big-road/${cell.status ? 'player-pair-dot' : 'banker-pair-dot'}.png`;
        }
        return null;
    };

    const getNaturalImage = (): string => {
        return '/static/images/baccarat/scoreboard/big-road/natural.png';
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
            <div
                className={`${styles["scoreboard-content"]} baccarat-big-road`}
                ref={scrollDivRef}
                style={{
                    width: '800px',
                    position: 'relative',
                    border: isDevelopment ? '1px solid red' : undefined // Debug border
                }}
            >

                <div
                    className={styles['grid-container']}
                    style={{
                        gridTemplateRows: `repeat(${maxRows}, var(--cell-size))`,
                        gridAutoColumns: 'var(--cell-size)',
                        position: 'relative',
                        zIndex: 2
                    }}
                >
                    {/* {isDevelopment && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: 'url(/static/images/baccarat/scoreboard/big-road/demo-result.png)',
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundColor: 'rgba(255,0,0,0.1)', // Debug background
                                opacity: 0.3,
                                pointerEvents: 'none',
                                zIndex: 1
                            }}
                        />
                    )} */}
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

                                const imagePath = getDotImage(cell);

                                return (
                                    <div
                                        className={styles["dot-item"]}
                                        style={{
                                            gridColumnStart: colIndex + 1,
                                            gridRowStart: rowIndex + 1
                                        }}
                                        key={`${rowIndex}_${colIndex}`}
                                        data-round-id={cell.roundId}
                                    >
                                        <div className={styles["dot-image"]}>
                                            <img src={imagePath} alt={cell.status ? "Player" : "Banker"} />
                                            {cell.hasPair && (
                                                <img
                                                    className={styles["pair-dot"]}
                                                    src={getPairDotImage(cell)}
                                                    alt={`${cell.status ? "Player" : "Banker"} Pair`}
                                                />
                                            )}
                                            {cell.isNatural && (
                                                <img
                                                    className={styles["natural-image"]}
                                                    src={getNaturalImage()}
                                                    alt="Natural"
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