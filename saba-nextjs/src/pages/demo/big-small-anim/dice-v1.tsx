import React, { useMemo } from "react";
import styles from "./styles.module.scss";

interface DiceV1Props {
    diceNumber: number;
    rolling: boolean;
}

const DiceV1: React.FC<DiceV1Props> = ({ diceNumber, rolling }) => {
    const diceClass = useMemo(() => (rolling ? "dice-rolling" : `dice-${diceNumber}`), [diceNumber, rolling]);

    const backgroundImage = useMemo(() => `url(/static/images/big-small/dice-${diceNumber ? '1': "question-mark"}.png)`, [diceNumber]);

    return (
        <div className={`${styles.dice} ${styles[diceClass]}`}>
            <div
                className={`${styles.face} ${styles.front}`}
                style={{ backgroundImage }}
            ></div>
            <div className={`${styles.face} ${styles.back}`}></div>
            <div className={`${styles.face} ${styles.top}`}></div>
            <div className={`${styles.face} ${styles.bottom}`}></div>
            <div className={`${styles.face} ${styles.right}`}></div>
            <div className={`${styles.face} ${styles.left}`}></div>
        </div>
    );
};

export default DiceV1;
