import React from "react";
import Coin, { CoinSymbol } from "../../../../_shared/components/coin";
import { Size } from "../../../../_shared/constants";
import styles from "./empty-coin-row.module.scss";

interface IEmptyDiceRowProps {
    count?: number;
    size?: typeof Size[keyof typeof Size];
    isFinishedShowResult?: boolean;
    blinking?: boolean;
}

export const EmptyCoinRow: React.FC<IEmptyDiceRowProps> = ({
    size = Size.medium,
    isFinishedShowResult = false,
    blinking = false
}) => {
    return (
        <div
            key={"empty-coin-container"}
            className={`${styles.diceContainer} 
                        ${isFinishedShowResult ? styles.animated : ''} 
                        ${blinking ? styles.blinking : ''} 
                        ${styles.animationDelay}`}
        >
            <Coin
                data-testid={"empty-coin"}
                coinType={CoinSymbol.EMPTY}
                size={size}
            />
        </div>
    );
};

export default EmptyCoinRow;