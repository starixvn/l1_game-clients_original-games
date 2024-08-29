import * as gc from "@sg/sg-game-client";
import { RoundHistoryStore } from "@sg/sg-game-client/dist/game/round-histories";
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
        this.setState({ rounds: rounds.slice(0, 6) });
    }

    render() {
        const { rounds } = this.state;
        if (!rounds || rounds.length === 0) {
            return <></>;
        }
        const roundHistories = rounds as gc.RoundHistories.RoundHistory[];
        console.log("roundHistories", roundHistories);

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

    @render(RoundHistoryStore, (store) => store.firstJoinGameHistory)
    renderStaticResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory) {
        if (!firstJoinGameHistory) {
            return;
        }
        const { roundHistory } = firstJoinGameHistory;
        // this.setHighlightStatic(staticHighlight, animationHighlight, roundHistory);
        const { rounds } = this.state;
        if (!rounds || rounds.length === 0) {
            return;
        }
        console.log("renderStaticResult");
        debugger;
        rounds[5] = roundHistory;
        this.setState({ rounds });
    }

    @render(RoundHistoryStore, (store) => store.joinGameHistory)
    handleJoinGameAndShowResult(joinGameHistory: gc.RoundHistories.IJoinGameHistory) {
        const { roundHistory } = joinGameHistory ?? {};
        if (roundHistory) {
            console.log("handleJoinGameAndShowResult bf");
            const { rounds } = this.state;
            if (!rounds || rounds.length === 0) {
                return;
            }
            console.log("handleJoinGameAndShowResult af");

            rounds[0] = roundHistory;
            this.setState({ rounds });
        }
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
