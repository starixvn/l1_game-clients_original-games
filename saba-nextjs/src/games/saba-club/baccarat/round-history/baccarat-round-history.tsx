import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import { Stack } from "react-bootstrap";
import { RoundDot } from "../../../../_shared/components/dot";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import Styles from "./baccarat-round-history.module.scss";
import { IBaccaratResult, BaccaratSettlementResult } from "../type";

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

    private getSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult): BaccaratSettlementResult {
        const result: BaccaratSettlementResult = {
            winner: 'player',
            player: false,
            banker: false,
            tie: false,
            playerPair: false,
            bankerPair: false
        };

        if (settlementResult && typeof settlementResult === "object") {
            result.player = !!settlementResult.player;
            result.banker = !!settlementResult.banker;
            result.tie = !!settlementResult.tie;

            if (settlementResult.player) {
                result.winner = 'player';
            } else if (settlementResult.banker) {
                result.winner = 'banker';
            } else if (settlementResult.tie) {
                result.winner = 'tie';
            }

            const gameData = settlementResult.gameData;
            if (gameData && typeof gameData === "object") {
                const data = gameData as Record<string, unknown>;
                result.playerPair = !!data.playerPair;
                result.bankerPair = !!data.bankerPair;
            }
        }

        return result;
    }

    private RoundHistoryItem(roundHistory: gc.RoundHistories.RoundHistory): JSX.Element {
        if (!roundHistory.settlementResult) {
            return <></>;
        }
        const settlement = this.getSettlementResult(roundHistory.settlementResult);
        const beadPath = `/static/images/baccarat/scoreboard/indicator/${settlement.winner}-bead.png`;

        return (
            <Stack key={roundHistory.roundId} direction="horizontal" gap={1} className={Styles["history-item"]}>
                <div className={`${Styles["baccarat-dot"]} ${Styles[settlement.winner]}`}>
                    <img src={beadPath} alt={settlement.winner} width="24" height="24" />
                </div>
                <span className={Styles["arrow"]}></span>
            </Stack>
        );
    }

    private getResult(settlementResult: gc.GameServiceMessage.TSettlementResult): IBaccaratResult {
        const result: IBaccaratResult = {
            playerValue: 0,
            bankerValue: 0
        };

        if (settlementResult && typeof settlementResult === "object") {
            // Extract scores if available in settlement data
            const gameData = settlementResult.gameData;
            if (gameData && typeof gameData === "object") {
                const data = gameData as Record<string, unknown>;

                if ("playerScore" in data) {
                    result.playerValue = Number(data.playerScore) || 0;
                }
                if ("bankerScore" in data) {
                    result.bankerValue = Number(data.bankerScore) || 0;
                }
            }
        }

        return result;
    }
} 