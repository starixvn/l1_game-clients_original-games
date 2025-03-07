import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import { Stack } from "react-bootstrap";
import { RoundDot } from "../../../../_shared/components/dot";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import { BigSmallChoices, BigSmallSettlementResult } from "../type";
import Styles from "./big-small-round-history.module.scss";


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
                <Stack direction="horizontal" gap={1} className={Styles["hstack-round"]}>
                    <span>Previous Rounds:</span>
                    {roundHistories.toReversed().map((roundHistory) => {
                        return this.RoundHistoryItem(roundHistory);
                    })}
                    <RoundDot
                        highlight={true}
                        size="large"
                        value={"?"}
                        choice="next"
                        className={`${Styles["bigsmall-dot"]} ${Styles["next"]}`}
                    />
                </Stack>
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
            <Stack key={roundHistory.roundId} direction="horizontal" gap={1} className={Styles["history-item"]}>
                <RoundDot
                    choice={settlement.winner}
                    size="large"
                    value={settlement.winner.charAt(0).toUpperCase()}
                    className={`${Styles["bigsmall-dot"]} ${Styles[settlement.winner]}`}
                />
                <span className={Styles["arrow"]}></span>
            </Stack>
        );
    }
}
