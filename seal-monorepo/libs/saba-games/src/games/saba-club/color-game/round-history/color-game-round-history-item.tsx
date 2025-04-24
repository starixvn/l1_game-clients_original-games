import * as gc from "@sg/sg-game-client";
import React from "react";
import ColorGameDice from "../../../../_shared/components/color-game-dice";
import { Size } from "../../../../_shared/constants";
import styles from "./color-game-round-history.module.scss";

interface IColorGameRoundHistoryItemProps {
    roundHistory: gc.RoundHistories.RoundHistory;
    showArrow?: boolean;
}

export const ColorGameRoundHistoryItem: React.FC<IColorGameRoundHistoryItemProps> = ({
    roundHistory,
    showArrow = true
}) => {
    if (!roundHistory.settlementResult || !roundHistory.result) {
        return <React.Fragment />;
    }

    return (
        <div key={roundHistory.roundId} className={styles["history-item"]}>
            <ColorGameDice
                symbol={roundHistory.result["dice1"]}
                size={Size.medium}
            />
            <ColorGameDice
                symbol={roundHistory.result["dice2"]}
                size={Size.medium}
            />
            <ColorGameDice
                symbol={roundHistory.result["dice3"]}
                size={Size.medium}
            />
            {showArrow && <span className={styles["arrow"]}></span>}
        </div>
    );
};

export default ColorGameRoundHistoryItem;