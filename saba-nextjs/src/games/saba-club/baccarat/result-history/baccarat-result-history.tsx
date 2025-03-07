import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import Styles from "./baccarat-result-history.module.scss";
import { BaccaratSettlementResult } from "../type";
import { ResultCardSection } from "./result-card-section";
import { Result } from "../baccarat";

export interface IBaccaratResultHistoryState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
}

const numberOfResult = 102;

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

    renderRoundResult(roundHistory: gc.RoundHistories.RoundHistory, index: number) {
        const result = roundHistory?.result as Result;
        const settlement = this.getSettlementResult(roundHistory.settlementResult);

        return (
            <div className={Styles.historyRow} key={index}>
                <div className={Styles.contentWrapper}>
                    <span className={Styles.roundNumber}>{roundHistory?.roundId}</span>
                    <ResultCardSection cards={result?.player} />
                    <span className={Styles.divider} />
                    <ResultCardSection cards={result?.banker} />
                    <span className={`${Styles.winner} ${Styles[settlement.winner]}`}>
                        {settlement.winner.charAt(0).toUpperCase() + settlement.winner.slice(1)}
                    </span>
                </div>
            </div>
        );
    }

    render() {
        const { rounds } = this.state;
        if (!rounds || rounds.length === 0) {
            return null;
        }

        return (
            <div className={Styles.resultHistoryContainer}>
                <div className={Styles["result-title"]}>Result</div>
                <div className={Styles.resultHistory}>
                    <div className={Styles.header}>
                        <span>Round</span>
                        <span>Player</span>
                        <span className={Styles.divider} />
                        <span>Banker</span>
                        <span></span>
                    </div>
                    <div className={Styles.historyContent}>
                        {rounds.map(this.renderRoundResult.bind(this))}
                    </div>
                </div>
            </div>
        );
    }
} 