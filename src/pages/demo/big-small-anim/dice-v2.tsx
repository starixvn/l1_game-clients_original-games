import React, { useMemo } from "react";
import styles from "./dicev2.module.scss";

interface DiceProps {
    diceNumber: number;
    rolling: boolean;
}

const DiceV2: React.FC<DiceProps> = ({ diceNumber, rolling }) => {

    const diceClass = `dice-${diceNumber}`;    
    return (
        <div className={`${styles.dice}`}>
            {
                diceNumber === 0 ? (
                    <div className={`${styles.face} ${styles.dicequestionmarker}`}></div>
                ): (
                    <div className={`${styles.face} ${styles[diceClass]}`}></div>
                )
            }
        </div>
    );
};

export default DiceV2;
