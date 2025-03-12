import React, { useMemo } from 'react'
import styles from "./dice.module.scss";
import { Size } from 'libs/saba-games/src/_shared/constants';

const diceImages: Record<number, string> = {
  0: "/static/images/big-small/dice-question-mark.svg",
  1: "/static/images/big-small/dice-1.svg",
  2: "/static/images/big-small/dice-2.svg",
  3: "/static/images/big-small/dice-3.svg",
  4: "/static/images/big-small/dice-4.svg",
  5: "/static/images/big-small/dice-5.svg",
  6: "/static/images/big-small/dice-6.svg",
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
