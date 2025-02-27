import React, { useMemo } from "react";
import styles from "./styles.module.scss";

interface DiceProps {
    diceNumber: number;
    rolling: boolean;
}

const Dice: React.FC<DiceProps> = ({ diceNumber, rolling }) => {
    const diceClass = useMemo(() => (rolling ? "dice-rolling" : `dice-${diceNumber}`), [diceNumber, rolling]);

    return (
        <div className={`${styles.dice} ${styles[diceClass]}`}>
            <div
                className={`${styles.face} ${styles.front}`}
                style={{
                    backgroundImage: `url(/static/images/big-small/dice-${diceNumber ? '1': "question-mark"}.png)`,
                }}
            ></div>
            <div className={`${styles.face} ${styles.back}`}></div>
            <div className={`${styles.face} ${styles.top}`}></div>
            <div className={`${styles.face} ${styles.bottom}`}></div>
            <div className={`${styles.face} ${styles.right}`}></div>
            <div className={`${styles.face} ${styles.left}`}></div>
        </div>
    );
};

export default Dice;
