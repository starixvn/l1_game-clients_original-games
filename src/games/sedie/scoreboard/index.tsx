import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../_shared/components/observer-component/observer-component";
import Styles from "./scoreboard.module.scss";
import { RoundDot } from "../../../_shared/components/dot";
import { SeDieChoices, SedieResult, SedieSettlementResult } from "../type";
import { BigRoadScoreboard, Converter } from "sc-scoreboards";
import { createRef } from "react";
import React from "react";

export interface ISeDieResultHistoryState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
}

export class SedieBigRoadConverter extends Converter<SedieSettlementResult> {
    static addBlinkNode(rounds: SedieSettlementResult[]) {
        const lastRound = rounds.find((round) => round.odd || round.even);

        const blinkRound = {
            even: lastRound?.even,
            odd: undefined,
            red2: undefined,
            red3: undefined,
            red4: undefined,
            white3: undefined,
            white4: undefined,
        };

        rounds.unshift(blinkRound);
    }

    static instance = new SedieBigRoadConverter();

    protected positiveKey(): string {
        return SeDieChoices.even;
    }

    protected specialKey(): string {
        return "";
    }
}

export class SedieScoreBoard extends ObserverComponent<IPropsObserver, ISeDieResultHistoryState> {
    private scrollDivRef = createRef<HTMLDivElement>();

    constructor(props: IPropsObserver) {
        super(props);

        this.scrollDivRef = React.createRef();
    }

    componentDidUpdate(prevProps, prevState) {
        // Scroll to right if items have changed
        if (prevState.rounds !== this.state.rounds) {
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
        this.setState({ rounds: rounds });
    }

    renderDots = (roundHistory: gc.RoundHistories.RoundHistory) => {
        const result = roundHistory.result as SedieResult;
        const dots = [result.red1, result.red2, result.red3, result.red4];
        return dots.map((isRed, index) => <RoundDot key={index} choice={isRed ? SeDieChoices.odd : SeDieChoices.even} size="small" />);
    };

    render() {
        const { rounds } = this.state;
        if (!rounds || rounds.length === 0) {
            return <></>;
        }

        const bigRoad = new BigRoadScoreboard({ converter: SedieBigRoadConverter.instance, height: 6 });
        const settlements = rounds.map((round) => {
            return round.settlementResult as SedieSettlementResult;
        });
        const input = [...settlements].reverse();
        bigRoad.initialize(input);
        const rows = bigRoad.rows();

        const getDotClass = (status: boolean) => {
            return status ? Styles["dot-even"] : Styles["dot-odd"];
        };

        const calPercentage = (settlements: SedieSettlementResult[]) => {
            const totalCount = settlements.length;

            const oddCount = settlements.filter((entry) => entry.odd).length;
            const evenCount = settlements.filter((entry) => entry.even).length;

            const oddPercentage = totalCount > 0 ? parseFloat(((oddCount / totalCount) * 100).toFixed(2)) : 0;
            const evenPercentage = totalCount > 0 ? parseFloat(((evenCount / totalCount) * 100).toFixed(2)) : 0;

            return {
                oddPercentage,
                evenPercentage,
            };
        };

        const percentages = calPercentage(settlements);
        return (
            <div className={Styles["scoreboard"]}>
                <div className={Styles["scoreboard-title"]}>Sedie Scoreboard</div>
                <div className={Styles["scoreboard-percentage"]}>
                    <div className={Styles["odd-percentage"]}>{`Odd ${percentages.oddPercentage}%`}</div>
                    <div className={Styles["split-percentage"]}>|</div>
                    <div className={Styles["even-percentage"]}>{`Even ${percentages.evenPercentage}%`}</div>
                </div>
                <div className={Styles["scoreboard-content"]} ref={this.scrollDivRef}>
                    {rows.map((row, row_index) => {
                        return row.map((point, col_index) => {
                            return point.index >= 0 ? (
                                <div
                                    className={Styles["dot-item"]}
                                    style={{ gridColumnStart: col_index + 1, gridRowStart: row_index + 1 }}
                                    key={`${row_index}_${col_index}`}
                                >
                                    <div className={getDotClass(point.status)}>{point.status ? "E" : "O"}</div>
                                </div>
                            ) : (
                                <div className={Styles["dot-item"]} key={`${row_index}_${col_index}`}></div>
                            );
                        });
                    })}
                </div>
            </div>
        );
    }
}
