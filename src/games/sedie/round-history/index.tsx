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
        this.setState({ rounds: rounds.slice(0, 10) } as ISeDieRoundHistoryState);
    }

    render() {
        const { rounds } = this.state as ISeDieRoundHistoryState;
        const roundHistories = rounds as gc.RoundHistories.RoundHistory[];
        console.log("roundHistories", roundHistories);
        return (
            <Row>
                {roundHistories.map((roundHistory) => {
                    return this.RoundHistoryResult(roundHistory);
                })}
            </Row>
        );
    }

    private RoundHistoryResult(roundHistory: gc.RoundHistories.RoundHistory): JSX.Element {
        const { value, color } = this.getResult(roundHistory.settlementResult);
        const isRed = color.includes("red");
        console.log(roundHistory.roundId);
        return (
            <Col key={roundHistory.roundId}>
                <RoundDot choice={isRed ? SeDieChoices.odd : SeDieChoices.even} size="large" value={value} />
            </Col>
        );
    }

    private getResult(settlementResult: gc.GameServiceMessage.TSettlementResult): { value: string; color: string } {
        let color = "",
            value = "";
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
