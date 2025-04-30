import React, { useState, useEffect } from 'react';
import emptyImage from "../../../assets/coin/empty.png"
import headImage from "../../../assets/coin/head.png"
import tailImage from "../../../assets/coin/tail.png"
import { Size } from "../../../_shared/constants";
import styles from "./animated-coin.module.scss"
import { CoinSymbol } from '.';

interface ICoinProps {
  size?: typeof Size.large | typeof Size.medium | typeof Size.small;
  onFlipEnd?: (symbol: CoinSymbol) => void;
  result?: CoinSymbol;
}

const AnimatedCoin: React.FC<ICoinProps> = ({ 
  size = Size.medium,
  onFlipEnd,
  result = CoinSymbol.HEAD
}) => {
  const [isFlipping, setIsFlipping] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipping(false);
      if (onFlipEnd) {
        onFlipEnd(result);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [onFlipEnd, result]);

  const flipClass = result === CoinSymbol.HEAD ? 'flipping-head' : 'flipping-tail';

  return (
    <div className={styles['coin-container']}>
      <div 
        className={`${styles.coin} ${styles[size]} ${isFlipping ? styles[flipClass] : ''}`}
      >
        {/* 正面 */}
        <div 
          className={`${styles['coin-face']} ${styles.front}`}
          style={{ backgroundImage: `url(${headImage})` }}
        />
        
        {/* 背面 */}
        <div 
          className={`${styles['coin-face']} ${styles.back}`}
          style={{ backgroundImage: `url(${tailImage})` }}
        />

        {/* 硬幣邊緣 */}
        <div className={styles['coin-edge']}>
          {[...Array(36)].map((_, index) => (
            <div key={index} className={styles['coin-edge-segment']} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnimatedCoin;