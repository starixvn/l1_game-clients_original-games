import React from 'react';
import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import styles from './baccarat-scoreboards.module.scss';
import { BaccaratBetPercentages } from '../baccarat-bet-percentages';
import {
    DEFAULT_CONFIG,
    GridCell,
    organizeDataForBigRoad,
    getSettlementResult
} from './baccarat-big-road-patterns';
import { RoundHistoryTestData } from '../baccarat-anim/constants';

interface IBaccaratBigRoadState extends IStateObserver {
    gridData: (GridCell | null)[][];
    rounds: gc.RoundHistories.RoundHistory[];
    roundState: string;
}

interface Props extends IPropsObserver {
    gameName?: string;
    maxRows?: number;
    noRender?: boolean;
}

export class BaccaratBigRoad extends ObserverComponent<Props, IBaccaratBigRoadState> {
    private scrollDivRef = React.createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);
        this.state = {
            gridData: [],
            rounds: [],
            roundState: '',
            dispose: () => { }
        };
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
    private onRoundHistoryUpdate(rounds: gc.RoundHistories.RoundHistory[]) {
        this.setState({ rounds: RoundHistoryTestData });
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundState)
    private onRoundStateUpdate(roundState: string) {
        if (this.state.roundState !== roundState) {
            this.setState({ roundState }, () => {
                this.processRounds(this.state.rounds);
            });
        }
    }

    private getDotImage = (cell: GridCell): string => {
        if (cell.isBlink) {
            return '/static/images/baccarat/scoreboard/big-road/Rectangle 9391.png';
        }

        // Regular player or banker win (base circle)
        return `/static/images/baccarat/scoreboard/big-road/${cell.status ? 'player' : 'banker'}.png`;
    };

    private getPairDotImage = (cell: GridCell): string[] => {
        const pairDots: string[] = [];
        if (cell.playerPair) {
            pairDots.push('/static/images/baccarat/scoreboard/big-road/player-pair-dot.png');
        }
        if (cell.bankerPair) {
            pairDots.push('/static/images/baccarat/scoreboard/big-road/banker-pair-dot.png');
        }
        return pairDots;
    };

    private getNaturalImage = (): string => {
        return '/static/images/baccarat/scoreboard/big-road/natural.png';
    };

    private getTieImage = (): string => {
        return '/static/images/baccarat/scoreboard/big-road/tie.png';
    };

    private processRounds = (rounds: gc.RoundHistories.RoundHistory[]) => {
        if (!rounds?.length) return;
        const maxRows = this.props.maxRows || DEFAULT_CONFIG.maxRows;
        const gridData = organizeDataForBigRoad(rounds, maxRows, this.state.roundState, getSettlementResult);
        this.setState({ gridData });
    };

    render() {
        const { noRender, gameName, maxRows = DEFAULT_CONFIG.maxRows } = this.props;
        const { gridData, rounds } = this.state;

        if (noRender || !rounds?.length) {
            return null;
        }

        const settlements = rounds.map(round => getSettlementResult(round.settlementResult));

        return (
            <div className={styles.scoreboard}>
                <div className={styles["scoreboard-title"]}>ScoreBoard</div>
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
                            gridAutoColumns: 'var(--cell-size)',
                            position: 'relative',
                            zIndex: 2
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

                                    const imagePath = this.getDotImage(cell);

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
                                                {(cell.playerPair || cell.bankerPair) && this.getPairDotImage(cell).map((pairDot, index) => (
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
                                                        src={this.getNaturalImage()}
                                                        style={{ width: '16px', height: '16px' }}
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
                                                            src={this.getTieImage()}
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
    }
} 