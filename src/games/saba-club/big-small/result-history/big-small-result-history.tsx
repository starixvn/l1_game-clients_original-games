import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import Styles from "./big-small-result-history.module.scss";
import { BigSmallResult, BigSmallSettlementResult } from "../type";
import Dice from "../settlement-result/components/dice";
import { Size } from "../../../../_shared/constants";

export interface IBigSmallResultHistoryState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
}

const numberOfResult = 100;
export default class BigSmallResultHistory extends ObserverComponent<IPropsObserver, IBigSmallResultHistoryState> {
    constructor(props: IPropsObserver) {
        super(props);
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(rounds: gc.RoundHistories.RoundHistory[]) {
        this.setState({ rounds: rounds.slice(0, numberOfResult) });
    }

    renderDices = (roundHistory: gc.RoundHistories.RoundHistory) => {
        const result = roundHistory.result as BigSmallResult;
        const dices = [result.dice1, result.dice2, result.dice3];
        return dices.map((diceNumber, index) => <Dice key={index} diceNumber={diceNumber} size={Size.medium} />);
    };

    renderBigSmall(roundHistory: gc.RoundHistories.RoundHistory) {
        const { settlementResult } = roundHistory;
        const { big } = settlementResult as BigSmallSettlementResult;
        
        const resultText = big 
            ? gc.Translator.t("UnbalancedBigSmall4.big")
            : gc.Translator.t("UnbalancedBigSmall4.small");
            
        return (
            <div className={Styles[big ? "big" : "small"]}>
                {resultText}
            </div>
        );
    }

    renderRoundResult(roundHistory: gc.RoundHistories.RoundHistory, index: number) {
        return (
            <div className={Styles["result-item"]} key={index}>
                <div>{`No.${roundHistory.roundId}`}</div>
                <div className={Styles["item-dot"]}>{this.renderDices(roundHistory)}</div>
                <div>{this.renderBigSmall(roundHistory)}</div>
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
