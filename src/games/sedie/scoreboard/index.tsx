import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../_shared/components/observer-component/observer-component";
import Styles from "./scoreboard.module.scss";
import { RoundDot } from "../../../_shared/components/dot";
import { SeDieChoices, SedieResult, SedieSettlementResult } from "../type";
import { BigRoadScoreboard, BigRoadScoreboardPoint, Converter } from "sc-scoreboards";
import SeDieSettlementResult from "../settlement-result";

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

const numberOfResult = 5;
export class SedieScoreBoard extends ObserverComponent<IPropsObserver, ISeDieResultHistoryState> {
    constructor(props: IPropsObserver) {
        super(props);
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(rounds: gc.RoundHistories.RoundHistory[]) {
        this.setState({ rounds: rounds });
        console.log("rounds", this.state.rounds);
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
        const roundHistories = rounds as gc.RoundHistories.RoundHistory[];
        const bigRoad = new BigRoadScoreboard({ converter: SedieBigRoadConverter.instance, height: 6 });
        const settlements = rounds.map((round) => {
            return round.settlementResult as SedieSettlementResult;
        });
        console.log("settlements", settlements);
        bigRoad.initialize(settlements);
        const rows = bigRoad.rows();
        console.log("rows", rows);

        return (
            <div className={Styles["scoreboard"]}>
                <div>Sedie Scoreboard</div>
                <div className={Styles["scoreboard-content"]}>
                    <table>
                        {rows.map((row, row_index) => (
                            <tr className={Styles["scoreboard-row"]}>
                                {row.map((point, col_index) => (
                                    <td className={Styles["scoreboard-point"]}>{`${row_index}.${col_index}`}</td>
                                ))}
                            </tr>
                        ))}
                    </table>
                </div>
            </div>
        );
    }
}
