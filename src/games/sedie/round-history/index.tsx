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
    rounds: [];
}
export default class SeDieRoundHistory extends ObserverComponent<IPropsObserver, ISeDieRoundHistoryState> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            rounds: [],
        } as ISeDieRoundHistoryState;
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderOdds(rounds: gc.RoundHistories.RoundHistory[]) {
        this.setState({ rounds: rounds.slice(0, 6) } as ISeDieRoundHistoryState);
    }

    render() {
        const { rounds } = this.state as ISeDieRoundHistoryState;
        if (rounds.length == 0) {
            return <></>;
        }
        const roundHistories = rounds as gc.RoundHistories.RoundHistory[];
        console.log("roundHistories", roundHistories);
        console.log("length", roundHistories.length);
        console.log("roundHistories", rounds);

        return (
            <Row>
                <Col sm={2}>Previous round:</Col>
                {roundHistories.reverse().map((roundHistory) => {
                    return this.RoundHistoryItem(roundHistory);
                })}
                <Col key={roundHistories[roundHistories.length - 1].roundId} sm={2}>
                    <RoundDot highlight={true} size="large" value={"?"} />
                </Col>
            </Row>
        );
    }

    private RoundHistoryItem(roundHistory: gc.RoundHistories.RoundHistory): JSX.Element {
        const { value } = this.getResult(roundHistory.settlementResult);
        const isRed = value === "O";
        console.log(roundHistory.roundId);
        return (
            <Col key={roundHistory.roundId} sm={1}>
                <RoundDot choice={isRed ? SeDieChoices.odd : SeDieChoices.even} size="large" value={value} />
            </Col>
        );
    }

    private getResult(settlementResult: gc.GameServiceMessage.TSettlementResult): { value: string; color: string } {
        let color = "",
            value = "";
        settlementResult &&
            Object.keys(settlementResult).map((choice) => {
                if (settlementResult[choice]) {
                    if (choice === SeDieChoices.odd || choice === SeDieChoices.even) {
                        value = choice.charAt(0).toUpperCase();
                    }
                    color = choice;
                }
            });
        return { color, value };
    }
}
