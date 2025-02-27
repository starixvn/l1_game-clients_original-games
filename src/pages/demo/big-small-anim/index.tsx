import React, { useCallback, useState } from "react";
import DiceV2 from "./dice-v2";
import styles from "./styles.module.scss";

// Utility function to generate random dice numbers
const getRandomDiceNumbers = () => Array.from({ length: 3 }, () => Math.floor(Math.random() * 6) + 1);

// Utility function to calculate the total of dice numbers
const calculateTotalDiceNumber = (diceNumbers: number[]) => diceNumbers.reduce((acc, num) => acc + num, 0);

const BigSmallAnimDemo: React.FC = () => {
    const [diceState, setDiceState] = useState({
        rolling: false,
        diceNumbers: [0, 0, 0],
        totalDiceNumber: 0,
    });

    const rollDice = useCallback(() => {
        if (diceState.rolling) return;
        setDiceState((prevState) => ({ ...prevState, rolling: true }));

        const intervalId = setInterval(() => {
            setDiceState((prevState) => ({
                ...prevState,
                diceNumbers: getRandomDiceNumbers(),
            }));
        }, 80);

        setTimeout(() => {
            clearInterval(intervalId);
            const newDiceNumbers = getRandomDiceNumbers();
            setDiceState({
                rolling: false,
                diceNumbers: newDiceNumbers,
                totalDiceNumber: calculateTotalDiceNumber(newDiceNumbers),
            });
        }, 1000);
    }, [diceState.rolling]);

    const resetDice = useCallback(() => {
        setDiceState({
            rolling: false,
            diceNumbers: [0, 0, 0],
            totalDiceNumber: 0,
        });
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.diceContainer}>
                {diceState.diceNumbers.map((number, index) => (
                    <DiceV2 key={index} diceNumber={number} rolling={diceState.rolling} />
                ))}
                <div className={styles.diceResult}>{diceState.totalDiceNumber}</div>
            </div>
            <div className={styles.buttons}>
                <button
                    className={styles.roll}
                    onClick={rollDice}
                    disabled={diceState.rolling}
                    aria-label="Roll Dice"
                >
                    Roll Dice
                </button>
                <button
                    className={styles.roll}
                    onClick={resetDice}
                    aria-label="Reset Placing Bet"
                >
                    Reset Placing Bet
                </button>
            </div>
        </div>
    );
};

export default BigSmallAnimDemo;
