import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import { Stack } from "react-bootstrap";
import { RoundDot } from "../../../../_shared/components/dot";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import Styles from "../sic-ball.module.scss";
import { SicBallChoices } from "../type";

export interface ISicBallRoundHistoryState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
}
export default class SicBallRoundHistory extends ObserverComponent<IPropsObserver, ISicBallRoundHistoryState> {
    constructor(props: IPropsObserver) {
        super(props);
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(histories: gc.RoundHistories.RoundHistory[]) {
        this.setState({ rounds: histories.slice(0, 10) });
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.firstJoinGameHistory)
    renderFirstRoundHistory(firstJoinGameHistory: any) {
        // console.log({ firstJoinGameHistory });
    }

    render() {
        const { rounds } = this.state;
        if (!rounds || rounds.length === 0) {
            return <></>;
        }
        const roundHistories = rounds as gc.RoundHistories.RoundHistory[];

        return (
            <div className={Styles["round-history"]}>
                <div> Previous round:</div>
                <Stack direction="horizontal" gap={1} className={Styles["hstack-round"]}>
                    {roundHistories.toReversed().map((roundHistory) => {
                        return this.RoundHistoryItem(roundHistory);
                    })}
                    <RoundDot highlight={true} size="large" value={"?"} />
                </Stack>
            </div>
        );
    }

    private RoundHistoryItem(roundHistory: gc.RoundHistories.RoundHistory): JSX.Element {
        if (!roundHistory.settlementResult) {
            return <></>;
        }
        const value = this.getResult(roundHistory.settlementResult);
        const isBig = value === "B";

        return (
            <Stack key={roundHistory.drawId} direction="horizontal" gap={1}>
                <RoundDot choice={isBig ? SicBallChoices.big : SicBallChoices.small} size="large" value={value} />
                <span className={Styles["arrow"]}></span>
            </Stack>
        );
    }

    private getResult(settlementResult: gc.GameServiceMessage.TSettlementResult): string {
        let value = "";
        settlementResult &&
            Object.keys(settlementResult).map((choice) => {
                if (settlementResult[choice]) {
                    if (choice === SicBallChoices.big || choice === SicBallChoices.small) {
                        value = choice.charAt(0).toUpperCase();
                    }
                }
            });
        return value;
    }
}
