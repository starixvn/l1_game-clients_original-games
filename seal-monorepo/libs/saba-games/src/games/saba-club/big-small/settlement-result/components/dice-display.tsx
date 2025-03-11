import React, { memo, useEffect, useMemo, useState } from "react";
import styles from "../big-small-settlement-result.module.scss";
import { BigSmallResult } from "../../type";
import { calculateTotalDiceNumber, getRandomDiceNumbers } from "../../../../../_shared/utils/number-helper";
import Dice from "libs/saba-games/src/_shared/components/dice";

interface DiceListProps {
    diceNumbers: number[];
}

const DiceList: React.FC<DiceListProps> = ({ diceNumbers }) => {
    return (
        <div className={styles.diceList}>
            {diceNumbers.map((number, index) => (
                <Dice key={index} diceNumber={number} />
            ))}
        </div>
    );
};

interface DiceDisplayProps {
    result: BigSmallResult;
    isAnimationResult: boolean;
}

export const DiceDisplay: React.FC<DiceDisplayProps> = memo(({ result, isAnimationResult }) => {
    const [diceNumbers, setDiceNumbers] = useState([0, 0, 0]);
    const [totalDiceNumber, setTotalDiceNumber] = useState(0);

    useEffect(() => {
        if (isAnimationResult) {
            const intervalId = setInterval(() => {
                setDiceNumbers(getRandomDiceNumbers());
            }, 150);

            setTimeout(() => {
                clearInterval(intervalId);
                setDiceNumbers([result.dice1, result.dice2, result.dice3]);
                setTotalDiceNumber(calculateTotalDiceNumber([result.dice1, result.dice2, result.dice3]));
            }, 2000);
        } else {
            setDiceNumbers([result.dice1, result.dice2, result.dice3]);
            setTotalDiceNumber(calculateTotalDiceNumber([result.dice1, result.dice2, result.dice3]));
        }
    }, [isAnimationResult, result]);

    return (
        <div className={styles.diceContainer}>
            <DiceList diceNumbers={diceNumbers} />
            {
                totalDiceNumber > 0 && (
                    <div className={styles.diceResult}>{totalDiceNumber}</div>
                )
            }
        </div>
    );
});
