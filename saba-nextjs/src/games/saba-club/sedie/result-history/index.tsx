import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import Styles from "./result-history.module.scss";
import { RoundDot } from "../../../../_shared/components/dot";
import { SeDieChoices, SedieResult, SedieSettlementResult } from "../type";

export interface ISeDieResultHistoryState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
}

const numberOfResult = 100;
export class SedieResultHistory extends ObserverComponent<IPropsObserver, ISeDieResultHistoryState> {
    constructor(props: IPropsObserver) {
        super(props);
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(rounds: gc.RoundHistories.RoundHistory[]) {
        this.setState({ rounds: rounds.slice(0, numberOfResult) });
    }

    renderDots = (roundHistory: gc.RoundHistories.RoundHistory) => {
        const result = roundHistory.result as SedieResult;
        const dots = [result.red1, result.red2, result.red3, result.red4];
        return dots.map((isRed, index) => <RoundDot key={index} choice={isRed ? SeDieChoices.odd : SeDieChoices.even} size="small" />);
    };

    renderOddEven(roundHistory: gc.RoundHistories.RoundHistory) {
        const settlement = roundHistory.settlementResult as SedieSettlementResult;
        return settlement.odd ? <div className={Styles["odd"]}>ODD</div> : <div className={Styles["even"]}>EVEN</div>;
    }

    renderRoundResult(roundHistory: gc.RoundHistories.RoundHistory, index: number) {
        return (
            <div className={Styles["result-item"]} key={index}>
                <div>{`No.${roundHistory.roundId}`}</div>
                <div className={Styles["item-dot"]}>{this.renderDots(roundHistory)}</div>
                <div>{this.renderOddEven(roundHistory)}</div>
            </div>
        );
    }

    render() {
        const { rounds } = this.state;
        if (!rounds || rounds.length === 0) {
            return <></>;
        }
        const roundHistories = rounds as gc.RoundHistories.RoundHistory[];

        return (
            <div className={Styles["result-history"]}>
                <div className={Styles["result-title"]}>Result</div>

                <div className={Styles["result-content"]}>
                    {roundHistories.map((roundHistory, index) => {
                        return this.renderRoundResult(roundHistory, index);
                    })}
                </div>
            </div>
        );
    }
}
