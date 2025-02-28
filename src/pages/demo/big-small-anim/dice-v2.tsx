import React, { useMemo } from "react";
import styles from "./dice-v2.module.scss";

interface DiceProps {
    diceNumber: number;
}

const DiceV2: React.FC<DiceProps> = ({ diceNumber }) => {
    const diceClass = useMemo(() => `dice-${diceNumber}`, [diceNumber]);

    const faceClass = diceNumber === 0 ? styles.dicequestionmarker : styles[diceClass];

    return (
        <div className={styles.dice}>
            <div className={`${styles.face} ${faceClass}`}></div>
        </div>
    );
};

export default DiceV2;
