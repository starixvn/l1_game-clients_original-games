import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import Styles from "./baccarat-result-history.module.scss";
import { RoundDot } from "../../../../_shared/components/dot";
import { IBaccaratResult, BaccaratSettlementResult } from "../type";

export interface IBaccaratResultHistoryState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
}

const numberOfResult = 100;
export class BaccaratResultHistory extends ObserverComponent<IPropsObserver, IBaccaratResultHistoryState> {
    constructor(props: IPropsObserver) {
        super(props);
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(rounds: gc.RoundHistories.RoundHistory[]) {
        this.setState({ rounds: rounds.slice(0, numberOfResult) });
    }

    private getSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult): BaccaratSettlementResult {
        const result: BaccaratSettlementResult = {
            winner: 'player',
            playerPair: false,
            bankerPair: false
        };

        if (settlementResult && typeof settlementResult === "object") {
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

    renderResult(roundHistory: gc.RoundHistories.RoundHistory) {
        const result = roundHistory.result as IBaccaratResult;
        const settlement = this.getSettlementResult(roundHistory.settlementResult);

        return (
            <div className={Styles["result-value"]}>
                {/* <div className={Styles["player-value"]}>
                    Player: {result.playerValue}
                </div>
                <div className={Styles["banker-value"]}>
                    Banker: {result.bankerValue}
                </div> */}
                <div className={Styles[settlement.winner]}>
                    {settlement.winner.toUpperCase()}
                </div>
            </div>
        );
    }

    renderRoundResult(roundHistory: gc.RoundHistories.RoundHistory, index: number) {
        return (
            <div className={Styles["result-item"]} key={index}>
                <div>{`No.${roundHistory.roundId}`}</div>
                <div className={Styles["item-result"]}>{this.renderResult(roundHistory)}</div>
            </div>
        );
    }

    render() {
        const { rounds } = this.state;
        if (!rounds || rounds.length === 0) {
            return <></>;
        }
        const roundHistories = rounds as gc.RoundHistories.RoundHistory[];

        return (
            <div className={Styles["result-history"]}>
                <div className={Styles["result-title"]}>Result</div>
                <div className={Styles["result-content"]}>
                    {roundHistories.map((roundHistory, index) => {
                        return this.renderRoundResult(roundHistory, index);
                    })}
                </div>
            </div>
        );
    }
} 