import React, { useMemo } from "react";
import styles from "./dice.module.scss";

interface DiceProps {
    diceNumber: number;
}

const Dice: React.FC<DiceProps> = ({ diceNumber }) => {
    const diceClass = useMemo(() => `dice-${diceNumber}`, [diceNumber]);

    const faceClass = diceNumber === 0 ? styles.dicequestionmarker : styles[diceClass];

    return (
        <div className={styles.dice}>
            <div className={`${styles.face} ${faceClass}`}></div>
        </div>
    );
};

export default Dice;
