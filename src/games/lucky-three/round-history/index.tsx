import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import { Stack } from "react-bootstrap";
import { RoundDot } from "../../../_shared/components/dot";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../_shared/components/observer-component/observer-component";
import Styles from "../lucky-next.module.scss";
import { LuckyNextChoices } from "../type";

export interface ILuckyNextRoundHistoryState extends IStateObserver {
    rounds: gc.GameTurnBase.RoundHistories.RoundHistory[];
}
export default class LuckyNextRoundHistory extends ObserverComponent<IPropsObserver, ILuckyNextRoundHistoryState> {
    constructor(props: IPropsObserver) {
        super(props);
    }

    @render(gc.GameTurnBase.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(histories: gc.GameTurnBase.RoundHistories.RoundHistory[]) {
        this.setState({ rounds: histories.slice(0, 10) });
    }

    render() {
        const { rounds } = this.state;
        if (!rounds || rounds.length === 0) {
            return <></>;
        }
        const roundHistories = rounds as gc.GameTurnBase.RoundHistories.RoundHistory[];

        return (
            <div className={Styles["round-history"]}>
                <Stack direction="horizontal" gap={1} className={Styles["hstack-round"]}>
                    Previous round:
                    {roundHistories.toReversed().map((roundHistory) => {
                        return this.RoundHistoryItem(roundHistory);
                    })}
                    <RoundDot highlight={true} size="large" value={"?"} />
                </Stack>
            </div>
        );
    }

    private RoundHistoryItem(roundHistory: gc.GameTurnBase.RoundHistories.RoundHistory): JSX.Element {
        if (!roundHistory.settlementResult) {
            return <></>;
        }
        const value = this.getResult(roundHistory.settlementResult);
        const isOver = value === "O";

        return (
            <Stack key={roundHistory.drawId} direction="horizontal" gap={1}>
                <RoundDot choice={isOver ? LuckyNextChoices.over : LuckyNextChoices.under} size="large" value={value} />
                <span className={Styles["arrow"]}></span>
            </Stack>
        );
    }

    private getResult(settlementResult: gc.GameServiceMessage.TSettlementResult): string {
        let value = "";
        settlementResult &&
            Object.keys(settlementResult).map((choice) => {
                if (settlementResult[choice]) {
                    if (choice === LuckyNextChoices.over || choice === LuckyNextChoices.under) {
                        value = choice.charAt(0).toUpperCase();
                    }
                }
            });
        return value;
    }
}
