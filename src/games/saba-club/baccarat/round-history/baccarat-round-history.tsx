import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import { Stack } from "react-bootstrap";
import { RoundDot } from "../../../../_shared/components/dot";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import Styles from "./baccarat-round-history.module.scss";
import { IBaccaratResult } from "../type";

export interface IBaccaratRoundHistoryState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
}

export default class BaccaratRoundHistory extends ObserverComponent<IPropsObserver, IBaccaratRoundHistoryState> {
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
                        className={`${Styles["baccarat-dot"]} ${Styles["next"]}`}
                    />
                </Stack>
            </div>
        );
    }

    private RoundHistoryItem(roundHistory: gc.RoundHistories.RoundHistory): JSX.Element {
        if (!roundHistory.settlementResult) {
            return <></>;
        }
        const result = this.getResult(roundHistory.settlementResult);
        const { winner } = result;

        return (
            <Stack key={roundHistory.roundId} direction="horizontal" gap={1} className={Styles["history-item"]}>
                <RoundDot
                    choice={winner}
                    size="large"
                    value={winner.charAt(0).toUpperCase()}
                    className={`${Styles["baccarat-dot"]} ${Styles[winner]}`}
                />
                <span className={Styles["arrow"]}></span>
            </Stack>
        );
    }

    private getResult(settlementResult: gc.GameServiceMessage.TSettlementResult): IBaccaratResult {
        const result: IBaccaratResult = {
            playerScore: 0,
            bankerScore: 0,
            playerCards: [],
            bankerCards: [],
            winner: "player"
        };

        if (settlementResult && typeof settlementResult === "object") {
            // Extract winner
            if (settlementResult.player) {
                result.winner = "player";
            } else if (settlementResult.banker) {
                result.winner = "banker";
            } else if (settlementResult.tie) {
                result.winner = "tie";
            }

            // Extract scores and cards if available in settlement data
            const gameData = settlementResult.gameData;
            if (gameData && typeof gameData === "object") {
                const data = gameData as Record<string, unknown>;

                if ("playerScore" in data) {
                    result.playerScore = Number(data.playerScore) || 0;
                }
                if ("bankerScore" in data) {
                    result.bankerScore = Number(data.bankerScore) || 0;
                }
                if ("playerCards" in data && Array.isArray(data.playerCards)) {
                    result.playerCards = [...data.playerCards];
                }
                if ("bankerCards" in data && Array.isArray(data.bankerCards)) {
                    result.bankerCards = [...data.bankerCards];
                }
            }
        }

        return result;
    }
} 