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

const numberOfResult = 3;

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
        }

        return result;
    }


    renderResult(roundHistory: gc.RoundHistories.RoundHistory) {
        const result = roundHistory?.result as Result;
        const settlement = this.getSettlementResult(roundHistory.settlementResult);

        return (
            <div className={Styles.resultRow}>
                <div className={Styles.playerCards}>
                    <ResultCardSection cards={result?.player} />
                </div>
                <div className={Styles.bankerCards}>
                    <ResultCardSection cards={result?.banker} />
                </div>
                <div className={`${Styles.winner} ${Styles[settlement.winner]}`}>
                    {settlement.winner.charAt(0).toUpperCase() + settlement.winner.slice(1)}
                </div>
            </div>
        );
    }

    renderRoundResult(roundHistory: gc.RoundHistories.RoundHistory, index: number) {

        return (
            <div className={Styles.historyRow} key={index}>
                <div className={Styles.roundNumber}>{roundHistory?.roundId}</div>
                {this.renderResult(roundHistory)}
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
            <div className={Styles.resultHistory}>
                <div className={Styles.header}>
                    <div className={Styles.playerHeader}>Player</div>
                    <div className={Styles.divider}>|</div>
                    <div className={Styles.bankerHeader}>Banker</div>
                </div>
                <div className={Styles.historyContent}>
                    {roundHistories.map((roundHistory, index) => {
                        return this.renderRoundResult(roundHistory, index);
                    })}
                </div>
            </div>
        );
    }
} 