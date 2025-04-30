import * as gc from "@sg/sg-game-client";
import React from "react";
import Coin, { CoinSymbol } from "../../../../_shared/components/coin";
import { Size } from "../../../../_shared/constants";
import styles from "./coin-toss-round-history.module.scss";

interface ICoinTossRoundHistoryItemProps {
    roundHistory: gc.RoundHistories.RoundHistory;
    showArrow?: boolean;
}

export const CoinTossRoundHistoryItem: React.FC<ICoinTossRoundHistoryItemProps> = ({
    roundHistory,
    showArrow = true
}) => {
    if (!roundHistory.settlementResult || !roundHistory.result) {
        return <React.Fragment />;
    }

    const coinType = roundHistory.result["head"] ? CoinSymbol.HEAD : CoinSymbol.TAIL;
    return (
        <div key={roundHistory.roundId} className={styles["history-item"]}>
            <Coin
                coinType={coinType}
                size={Size.medium}
            />
            {showArrow && <span className={styles["arrow"]}></span>}
        </div>
    );
};

export default CoinTossRoundHistoryItem;