import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import { BigSmallChoices, BigSmallSettlementResult } from "../type";
import Styles from "./big-small-round-history.module.scss";
import classNames from 'classnames';
import { BigSmallRoundDot } from "../dot";


export interface IBigSmallRoundHistoryState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
}

export default class BigSmallRoundHistory extends ObserverComponent<IPropsObserver, IBigSmallRoundHistoryState> {
    constructor(props: IPropsObserver) {
        super(props);
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(rounds: gc.RoundHistories.RoundHistory[]) {
        this.setState({ rounds: rounds.slice(0, 10) });
    }

    render() {
        const { rounds } = this.state;
        if (!rounds || rounds.length === 0) {
            return <></>;
        }
        const roundHistories = rounds as gc.RoundHistories.RoundHistory[];

        return (
            <div className={Styles["round-history"]}>
                <div className={Styles["hstack-round"]}>
                    <span>Previous Rounds:</span>
                    {roundHistories.toReversed().map((roundHistory) => {
                        return this.RoundHistoryItem(roundHistory);
                    })}
                    <BigSmallRoundDot
                        highlight={true}
                        size="large"
                        value="?"
                        choice="next"
                    />
                </div>
            </div>
        );
    }

    private getSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult): BigSmallSettlementResult & { winner: string } {
        const result = {
            winner: BigSmallChoices.big,
            big: false,
            small: false
        };

        if (settlementResult && typeof settlementResult === "object") {
                const data = settlementResult as Record<string, unknown>;
                result.big = !!data.big;
                result.small = !!data.small;

                if (result.big) {
                    result.winner = BigSmallChoices.big;
                } else if (result.small) {
                    result.winner = BigSmallChoices.small;
                }
        }

        return result;
    }

    private RoundHistoryItem(roundHistory: gc.RoundHistories.RoundHistory): JSX.Element {
        if (!roundHistory.settlementResult) {
            return <></>;
        }
        const settlement = this.getSettlementResult(roundHistory.settlementResult);

        return (
            <div key={roundHistory.roundId} className={Styles["history-item"]}>
                <BigSmallRoundDot
                    choice={settlement.winner}
                    size="large"
                    value={settlement.winner.charAt(0).toUpperCase()}
                />
                <span className={Styles["arrow"]}></span>
            </div>
        );
    }
}
