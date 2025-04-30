import React, { useState, useEffect } from 'react';
import styles from './3d-coin.module.scss';
import { CoinSymbol } from '.';

interface I3DCoinProps {
      result?: CoinSymbol;
      onFlipEnd?: (symbol: CoinSymbol) => void;
      size?: number;
}

const ThreeDCoin: React.FC<I3DCoinProps> = ({
      result = CoinSymbol.HEAD,
      onFlipEnd,
      size = 100
}) => {
      const [isFlipping, setIsFlipping] = useState(true);

      useEffect(() => {
            const timer = setTimeout(() => {
                  setIsFlipping(false);
                  if (onFlipEnd) {
                        onFlipEnd(result);
                  }
            }, 2000); // 與動畫時間一致

            return () => clearTimeout(timer);
      }, [onFlipEnd, result]);

      const flipClass = result === CoinSymbol.HEAD ? 'flipping-head' : 'flipping-tail';

      // 生成邊緣片段
      const renderEdgeSegments = () => {
            const segments: JSX.Element[] = [];
            for (let i = 0; i < 36; i++) {
                  segments.push(
                        <div key={i} className={styles['coin-edge-segment']}>
                              {[...Array(4)].map((_, j) => (
                                    <div key={j} className={styles.notch} />
                              ))}
                        </div>
                  );
            }
            return segments;
      };

      return (
            <div className={styles['coin-container']}>
                  <div 
                        className={`${styles.coin} ${isFlipping ? styles[flipClass] : ''}`}
                        style={{ width: size, height: size }}
                  >
                        {/* 正面 */}
                        <div className={`${styles['coin-face']} ${styles.front}`}>
                              H
                        </div>
                        
                        {/* 背面 */}
                        <div className={`${styles['coin-face']} ${styles.back}`}>
                              T
                        </div>

                        {/* 硬幣邊緣 */}
                        <div className={styles['coin-edge']}>
                              {renderEdgeSegments()}
                        </div>
                  </div>
            </div>
      )

};

export default ThreeDCoin; 