import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import { FishPrawnCrabChoices, FishPrawnCrabSettlementResult } from "../type";
import FishPrawnCrabDice, { FishPrawnCrabSymbol } from "../../../../_shared/components/fish-prawn-crab-dice";
import { Size } from "../../../../_shared/constants";
import styles from "./fish-prawn-crab-round-history.module.scss";
import { FishPrawnCrabRoundHistoryTooltip } from "./tooltip";

interface FishPrawnCrabResult {
    symbols: {
        [key in FishPrawnCrabChoices]?: boolean;
    };
}

export interface IFishPrawnCrabRoundHistoryProps extends IPropsObserver {
    language: string;
}

export interface IFishPrawnCrabRoundHistoryState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
}

// Map FishPrawnCrabChoices to FishPrawnCrabSymbol
const choiceToSymbol: Record<FishPrawnCrabChoices, FishPrawnCrabSymbol> = {
    [FishPrawnCrabChoices.fish]: FishPrawnCrabSymbol.FISH,
    [FishPrawnCrabChoices.prawn]: FishPrawnCrabSymbol.PRAWN,
    [FishPrawnCrabChoices.crab]: FishPrawnCrabSymbol.CRAB,
    [FishPrawnCrabChoices.rooster]: FishPrawnCrabSymbol.ROOSTER,
    [FishPrawnCrabChoices.gourd]: FishPrawnCrabSymbol.GOURD,
    [FishPrawnCrabChoices.stag]: FishPrawnCrabSymbol.STAG, // Mapping 'coin' to 'stag' based on context
};

export default class FishPrawnCrabRoundHistory extends ObserverComponent<IFishPrawnCrabRoundHistoryProps, IFishPrawnCrabRoundHistoryState> {
    constructor(props: IFishPrawnCrabRoundHistoryProps) {
        super(props);
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(rounds: gc.RoundHistories.RoundHistory[]) {
        this.setState({ rounds: rounds.slice(0, 3) });
    }

    render() {
        const { rounds } = this.state;
        if (!rounds || rounds.length === 0) {
            return <></>;
        }
        const roundHistories = rounds as gc.RoundHistories.RoundHistory[];
        const t = (key) => gc.Translator.translate(key, { languageId: gc.Translator.getCurrentLanguageId() });

        return (
            <div className={styles["round-history"]}>
                <div className={styles["hstack-round"]}>
                    {t('Common.previous_round')}:
                    {roundHistories.toReversed().map((roundHistory) => {
                        return this.RoundHistoryItem(roundHistory);
                    })}
                    <FishPrawnCrabDice
                        symbol={FishPrawnCrabSymbol.EMPTY}
                        size={Size.medium}
                    />
                    <FishPrawnCrabDice
                        symbol={FishPrawnCrabSymbol.EMPTY}
                        size={Size.medium}
                    />
                    <FishPrawnCrabDice
                        symbol={FishPrawnCrabSymbol.EMPTY}
                        size={Size.medium}
                    />
                </div>
            </div>
        );
    }

    private getSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult): FishPrawnCrabSettlementResult & { winner: FishPrawnCrabChoices } {
        const result = {
            winner: FishPrawnCrabChoices.fish,
            [FishPrawnCrabChoices.fish]: false,
            [FishPrawnCrabChoices.prawn]: false,
            [FishPrawnCrabChoices.crab]: false,
            [FishPrawnCrabChoices.rooster]: false,
            [FishPrawnCrabChoices.gourd]: false,
            [FishPrawnCrabChoices.stag]: false
        };

        if (settlementResult && typeof settlementResult === "object") {
            const data = settlementResult as Record<string, unknown>;

            // Process each choice
            Object.values(FishPrawnCrabChoices).forEach(choice => {
                result[choice] = !!data[choice];
                if (result[choice]) {
                    result.winner = choice;
                }
            });
        }

        return result;
    }

    private RoundHistoryItem(roundHistory: gc.RoundHistories.RoundHistory): JSX.Element {

        if (!roundHistory.settlementResult || !roundHistory.result) {
            return <></>;
        }

        const settlement = this.getSettlementResult(roundHistory.settlementResult);
        const symbols = Object.entries(settlement)
            .filter(([key, value]) => key !== 'winner' && value === true)
            .map(([key]) => key as FishPrawnCrabChoices);

        return (
            <div key={roundHistory.roundId} className={styles["history-item"]}>
                <FishPrawnCrabDice
                    symbol={roundHistory.result["dice1"]}
                    size={Size.medium}
                />
                <FishPrawnCrabDice
                    symbol={roundHistory.result["dice2"]}
                    size={Size.medium}
                />
                <FishPrawnCrabDice
                    symbol={roundHistory.result["dice3"]}
                    size={Size.medium}
                />
                <span className={styles["arrow"]}></span>
                <FishPrawnCrabRoundHistoryTooltip
                    roundId={roundHistory.roundId}
                    winner={settlement.winner}
                    symbols={symbols}
                />
            </div>
        );
    }
} 