import React from "react";
import ColorGameDice, { ColorGameSymbol } from "../../../../_shared/components/color-game-dice";
import { Size } from "../../../../_shared/constants";
import styles from "./empty-dice-row.module.scss";

interface IEmptyDiceRowProps {
    count?: number;
    size?: typeof Size[keyof typeof Size];
    isFinishedShowResult?: boolean;
    blinking?: boolean;
}

export const EmptyDiceRow: React.FC<IEmptyDiceRowProps> = ({
    count = 3,
    size = Size.medium,
    isFinishedShowResult = false,
    blinking = false
}) => {
    return (
        <>
            {Array(count).fill(0).map((_, index) => (
                <div
                    key={`empty-dice-container-${index}`}
                    className={`${styles.diceContainer} 
                        ${isFinishedShowResult ? styles.animated : ''} 
                        ${blinking ? styles.blinking : ''}`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                >
                    <ColorGameDice
                        key={`empty-dice-${index}`}
                        data-testid={`empty-dice-${index}`}
                        symbol={ColorGameSymbol.RESULT}
                        size={size}
                    />
                </div>
            ))}
        </>
    );
};

export default EmptyDiceRow;