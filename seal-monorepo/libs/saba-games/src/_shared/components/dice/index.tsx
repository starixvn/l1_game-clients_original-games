import React from 'react'
import styles from "./dice.module.scss";
import { Size } from '../../../_shared/constants';
import diceQuestionMark from "../../../assets/big-small/dice-question-mark.svg";
import dice1 from "../../../assets/big-small/dice-1.svg";
import dice2 from "../../../assets/big-small/dice-2.svg";
import dice3 from "../../../assets/big-small/dice-3.svg";
import dice4 from "../../../assets/big-small/dice-4.svg";
import dice5 from "../../../assets/big-small/dice-5.svg";
import dice6 from "../../../assets/big-small/dice-6.svg";

const diceImages: Record<number, string> = {
  0: diceQuestionMark,
  1: dice1,
  2: dice2,
  3: dice3,
  4: dice4,
  5: dice5,
  6: dice6,
};

interface IDiceProps {
  diceNumber: number;
  size?: typeof Size.large | typeof Size.medium | typeof Size.small;
}

const Dice: React.FC<IDiceProps> = ({ diceNumber, size = Size.large }) => {
  
  const diceImageUrl = diceImages[diceNumber];

  return (
    <img
      className={styles[`dice-${size}`]}
      src={diceImageUrl}
      alt={`dice-${diceNumber || "unknown"}`}
    />
  );
};

export default Dice;
