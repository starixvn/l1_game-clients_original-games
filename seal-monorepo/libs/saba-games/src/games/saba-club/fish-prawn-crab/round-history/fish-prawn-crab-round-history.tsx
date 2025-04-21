import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import React from "react";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import styles from "./fish-prawn-crab-round-history.module.scss";
import FishPrawnCrabRoundHistoryItem from "./fish-prawn-crab-round-history-item";
import EmptyDiceRow from "./empty-dice-row";
import { MAX_DISPLAYED_ROUNDS } from "../constants/fish-prawn-crab-constants";

export interface IFishPrawnCrabRoundHistoryProps extends IPropsObserver {
    language: string;
}

export interface IFishPrawnCrabRoundHistoryState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
}

export default class FishPrawnCrabRoundHistory extends ObserverComponent<IFishPrawnCrabRoundHistoryProps, IFishPrawnCrabRoundHistoryState> {
    constructor(props: IFishPrawnCrabRoundHistoryProps) {
        super(props);
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(rounds: gc.RoundHistories.RoundHistory[]) {
        this.setState({ rounds: rounds.slice(0, MAX_DISPLAYED_ROUNDS) });
    }

    render(): React.ReactElement {
        const { rounds } = this.state;
        if (!rounds || rounds.length === 0) {
            return <React.Fragment />;
        }

        const roundHistories = rounds as gc.RoundHistories.RoundHistory[];
        const t = (key: string) => gc.Translator.translate(key, { languageId: gc.Translator.getCurrentLanguageId() });

        return (
            <div className={styles["round-history"]}>
                <div className={styles["hstack-round"]}>
                    {t('Common.previous_round')}:
                    {roundHistories.toReversed().map((roundHistory) => (
                        <FishPrawnCrabRoundHistoryItem
                            key={roundHistory.roundId}
                            roundHistory={roundHistory}
                        />
                    ))}
                    <EmptyDiceRow />
                </div>
            </div>
        );
    }
} 