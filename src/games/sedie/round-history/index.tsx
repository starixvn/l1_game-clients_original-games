import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import { Col, Container, Row, Stack } from "react-bootstrap";
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
        this.setState({ rounds: rounds.slice(0, 10) });
    }

    render() {
        const { rounds } = this.state;
        if (!rounds || rounds.length === 0) {
            return <></>;
        }
        const roundHistories = rounds as gc.RoundHistories.RoundHistory[];

        return (
            <Container className="mt-2">
                <Row>
                    <Col>
                        <Stack direction="horizontal" gap={1} className="mt-2">
                            Previous round:
                            {roundHistories.toReversed().map((roundHistory) => {
                                return this.RoundHistoryItem(roundHistory);
                            })}
                            <RoundDot highlight={true} size="large" value={"?"} />
                        </Stack>
                    </Col>
                </Row>
            </Container>
        );
    }

    private RoundHistoryItem(roundHistory: gc.RoundHistories.RoundHistory): JSX.Element {
        if (!roundHistory.settlementResult) {
            return <></>;
        }
        const value = this.getResult(roundHistory.settlementResult);
        const isRed = value === "O";

        return (
            <Stack key={roundHistory.roundId} direction="horizontal" gap={1}>
                <RoundDot choice={isRed ? SeDieChoices.odd : SeDieChoices.even} size="large" value={value} />
                &#8680;
            </Stack>
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
