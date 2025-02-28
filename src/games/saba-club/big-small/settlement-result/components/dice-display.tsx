import React, { memo, useEffect, useState } from "react";
import { BigSmallResult } from "../../type";
import DiceList from "./dice-list";
import { calculateTotalDiceNumber, getRandomDiceNumbers } from "../../../../../_shared/utils/number-helper";
import styles from "../styles.module.scss";

interface DiceDisplayProps {
    result: BigSmallResult;
    isAnimationResult: boolean;
}

export const DiceDisplay: React.FC<DiceDisplayProps> = memo(({ result, isAnimationResult }) => {
    const [diceNumbers, setDiceNumbers] = useState([0, 0, 0]);
    const [totalDiceNumber, setTotalDiceNumber] = useState(0);
    
    const updateDiceNumbers = (result) => {
        const resultDiceNumbers = [result.dice1, result.dice2, result.dice3];
        setDiceNumbers(resultDiceNumbers);
        const totalDiceNumber = calculateTotalDiceNumber(resultDiceNumbers);
        setTotalDiceNumber(totalDiceNumber);
    };

    useEffect(() => {
        if (isAnimationResult) {
            const intervalId = setInterval(() => {
                setDiceNumbers(getRandomDiceNumbers());
            }, 100);

            setTimeout(() => {
                clearInterval(intervalId);
                updateDiceNumbers(result);
            }, 2500);
        } else {
            updateDiceNumbers(result);
        }
    }, [isAnimationResult, result]);

    return (
        <div className={styles.diceContainer}>
            <DiceList diceNumbers={diceNumbers} />
            <div className={styles.diceResult}>{totalDiceNumber}</div>
        </div>
    );
});

DiceDisplay.displayName = "DiceDisplay";
