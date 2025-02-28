import React from "react";
import styles from "../styles.module.scss";
import Dice from "./dice";

interface DiceListProps {
    diceNumbers: number[];
}

const DiceList: React.FC<DiceListProps> = ({ diceNumbers }) => {
    return (
        <div 
        className={styles.diceList}
        >
            {diceNumbers.map((number, index) => (
                <Dice key={index} diceNumber={number} />
            ))}
        </div>
    );
};

export default DiceList;
