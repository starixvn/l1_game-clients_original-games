import React, { useCallback, useMemo, useState } from "react";
import Dice from "./dice";
import styles from "./styles.module.scss";
import DiceV2 from "./dice-v2";

const getRandomDiceNumbers = () => Array.from({ length: 3 }, () => Math.floor(Math.random() * 6) + 1);

const BigSmallAnimDemo: React.FC = () => {
    const [rolling, setRolling] = useState(false);
    const [diceNumbers, setDiceNumbers] = useState<number[]>([0, 0, 0]);

    const totalDiceNumber = useMemo(() => diceNumbers.reduce((acc, num) => acc + num, 0), [diceNumbers]);

    const rollDice = useCallback(() => {
        if (rolling) return;
        setRolling(true);
        const newNumbers = getRandomDiceNumbers();
        setDiceNumbers(newNumbers);
        setTimeout(() => setRolling(false), 1000);
    }, [rolling]);

    const resetDice = useCallback(() => setDiceNumbers([0, 0, 0]), []);

    return (
        <div className={styles.container}>
            <div className={styles.diceContainer}>
                {diceNumbers.map((number, index) => (
                    <Dice key={index} diceNumber={number} rolling={rolling} />
                ))}
                
                <div className={styles.diceResult}>{totalDiceNumber}</div>
            </div>
            <div className={styles.buttons}>
                <button className={styles.roll} onClick={rollDice} disabled={rolling}>
                    Roll Dice
                </button>
                <button className={styles.roll} onClick={resetDice}>
                    Reset Placing Bet
                </button>
            </div>
        </div>
    );
};

export default BigSmallAnimDemo;
