import React, { useMemo } from 'react'
import styles from "./dice.module.scss";
import { Size } from 'libs/saba-games/src/_shared/constants';

interface IDiceProps {
  diceNumber: number;
  size?: typeof Size.large | typeof Size.medium | typeof Size.small;
}

const Dice: React.FC<IDiceProps> = ({ diceNumber, size = Size.large }) => {
  
  const diceImageUrl = useMemo(() =>{
    if (diceNumber === 0) {
      return require(`../../../assets/big-small/dice-question-mark.png`);
    }
    return require(`../../../assets/big-small/dice-${diceNumber}.png`);
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
