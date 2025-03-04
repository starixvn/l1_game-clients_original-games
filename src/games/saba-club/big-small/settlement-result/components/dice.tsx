import React, { useMemo } from 'react'
import styles from "../styles.module.scss";
import { Size } from "../../../../../_shared/constants";

interface DiceProps {
  diceNumber: number;
  size?: typeof Size.large | typeof Size.medium | typeof Size.small;
}

const Dice: React.FC<DiceProps> = ({ diceNumber, size = Size.large }) => {
  
  const diceImageUrl = useMemo(() =>{
    if (diceNumber === 0) {
      return "/static/images/big-small/dice-question-mark.png"
    }
    return `/static/images/big-small/dice-${diceNumber}.png`;
  }, [diceNumber]);

  return (
      <img 
        className={`${styles[`dice-${size}`]}`} 
        src={diceImageUrl} 
        alt={`dice-${diceNumber}`} 
      />
  );
};

export default Dice;
