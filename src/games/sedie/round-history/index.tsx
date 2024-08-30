import * as gc from "@sg/sg-game-client";
import { render } from "observer";
import { Col, Row } from "react-bootstrap";
import {
    IPropsObserver,
    IStateObserver,
    ObserverComponent,
} from "../../../_shared/commom-components/observer-component/observer-component";
import { RoundDot } from "../../../components/dot";
import { SeDieChoices } from "../type";

export interface ISeDieRoundHistoryState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
}
export default class SeDieRoundHistory extends ObserverComponent<IPropsObserver, ISeDieRoundHistoryState> {
    constructor(props: IPropsObserver) {
        super(props);
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(rounds: gc.RoundHistories.RoundHistory[]) {
        console.log("update roundHistories", rounds.slice(0, 6));
        this.setState({ rounds: rounds.slice(0, 6) });
    }

    render() {
        const { rounds } = this.state;
        if (!rounds || rounds.length === 0) {
            return <></>;
        }
        const roundHistories = rounds as gc.RoundHistories.RoundHistory[];
        console.log("render roundHistories", roundHistories);

        return (
            <Row>
                <Col sm={2}>Previous round:</Col>
                {roundHistories.toReversed().map((roundHistory) => {
                    return this.RoundHistoryItem(roundHistory);
                })}
                <Col key={roundHistories[roundHistories.length - 1].roundId} sm={2}>
                    <RoundDot highlight={true} size="large" value={"?"} />
                </Col>
            </Row>
        );
    }

    private RoundHistoryItem(roundHistory: gc.RoundHistories.RoundHistory): JSX.Element {
        if (!roundHistory.settlementResult) {
            return <></>;
        }
        const value = this.getResult(roundHistory.settlementResult);
        const isRed = value === "O";
        console.log(roundHistory.roundId);
        return (
            <Col key={roundHistory.roundId} sm={1}>
                <RoundDot choice={isRed ? SeDieChoices.odd : SeDieChoices.even} size="large" value={value} />
            </Col>
        );
    }

    private getResult(settlementResult: gc.GameServiceMessage.TSettlementResult): string {
        let value = "";
        settlementResult &&
            Object.keys(settlementResult).map((choice) => {
                if (settlementResult[choice]) {
                    if (choice === SeDieChoices.odd || choice === SeDieChoices.even) {
                        value = choice.charAt(0).toUpperCase();
                    }
                }
            });
        return value;
    }
}
