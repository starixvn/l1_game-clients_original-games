import React from 'react';
import * as gc from "@sg/sg-game-client";
import styles from '../../../games/saba-club/baccarat/scoreboard/baccarat-scoreboards.module.scss';
import demoStyles from './baccarat-scoreboards-demo.module.scss';
import { BaccaratBetPercentages } from '../../../games/saba-club/baccarat/baccarat-bet-percentages';
import {
    DEFAULT_CONFIG,
    GridCell,
    organizeDataForBigRoad,
    getSettlementResult
} from '../../../games/saba-club/baccarat/scoreboard/baccarat-big-road-patterns';
import { RoundHistory, MultiDragonTailsDemo, TwoAlternatingDragonTailsDemo } from '../../../games/saba-club/baccarat/baccarat-anim/constants';
import { BaccaratScoreboard } from '../../../games/saba-club/baccarat/scoreboard/ver1/baccarat-scoreboard';
import BaccaratBigRoadDemo1 from './BaccaratBigRoadDemo1';

// Demo data
const DEMO_ROUNDS: gc.RoundHistories.RoundHistory[] = RoundHistory;

interface Props {
    gameName?: string;
    maxRows?: number;
    noRender?: boolean;
    title?: string;
    rounds?: gc.RoundHistories.RoundHistory[];
}

const BaccaratBigRoadDemo: React.FC<Props> = ({ noRender, gameName, maxRows = DEFAULT_CONFIG.maxRows, title = "ScoreBoard Demo", rounds = DEMO_ROUNDS }) => {
    const scrollDivRef = React.useRef<HTMLDivElement>(null);
    const [gridData, setGridData] = React.useState<(GridCell | null)[][]>([]);

    React.useEffect(() => {
        processRounds(rounds);
    }, [maxRows, rounds]);

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

    const getPairDotImage = (cell: GridCell): string[] => {
        const pairDots: string[] = [];
        if (cell.playerPair) {
            pairDots.push('/static/images/baccarat/scoreboard/big-road/player-pair-dot.png');
        }
        if (cell.bankerPair) {
            pairDots.push('/static/images/baccarat/scoreboard/big-road/banker-pair-dot.png');
        }
        return pairDots;
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

    if (noRender || !rounds?.length) {
        return null;
    }

    // Log array of winners
    const winners = rounds.map(round => {
        const result = getSettlementResult(round.settlementResult);
        return result.winner;
    });
    console.log('Round Winners:', winners);

    const settlements = rounds.map(round => getSettlementResult(round.settlementResult));

    return (
        <div className={styles.scoreboard}>
            <div className={styles["scoreboard-title"]}>{title}</div>
            <div className={`${styles["scoreboard-percentage"]} ${demoStyles["scoreboard-percentage-container"]}`}>
                <div className={styles["split-percentage"]}>
                    <BaccaratBetPercentages
                        gameName={gameName}
                        settlements={settlements}
                        rounds={rounds}
                    />
                </div>
            </div>
            <div
                className={`${styles["scoreboard-content"]} ${demoStyles["scoreboard-content"]} baccarat-big-road`}
                ref={scrollDivRef}
            >
                <div
                    className={`${styles['grid-container']} ${demoStyles['grid-container']}`}
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
                                            {(cell.playerPair || cell.bankerPair) && getPairDotImage(cell).map((pairDot, index) => (
                                                <img
                                                    key={index}
                                                    className={`${styles["pair-dot"]} ${cell.playerPair ? styles["player-pair"] : styles["banker-pair"]}`}
                                                    src={pairDot}
                                                    alt="Pair"
                                                />
                                            ))}
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

const BaccaratScoreboardsDemo: React.FC = () => {
    return (
        <div className={demoStyles["demo-container"]}>
            {/* <div className={demoStyles["demo-section"]}>
                <BaccaratBigRoadDemo
                    gameName="Baccarat"
                    title="Single Dragon Tail Pattern"
                    rounds={DEMO_ROUNDS}
                />
            </div>
            <div className={demoStyles["demo-section"]}>
                <BaccaratBigRoadDemo
                    gameName="Baccarat"
                    title="Multiple Dragon Tails Pattern"
                    rounds={MultiDragonTailsDemo}
                />
            </div> */}
            {/* <div className={demoStyles["demo-section"]}>
                <BaccaratBigRoadDemo
                    gameName="Baccarat"
                    title="Two Alternating Dragon Tails Pattern"
                    rounds={TwoAlternatingDragonTailsDemo}
                />
            </div> */}

            <BaccaratBigRoadDemo1 />
        </div>
    );
};

export default BaccaratScoreboardsDemo;