import React from 'react';
import styles from '../rng-soccer.module.scss';
import closeIcon from '../../../../assets/rng-soccer/close.svg';

interface RNGSoccerStatisticProps {
    namespace: string;
    language: string;
    isPopupVisible: boolean;
    togglePopup: () => void;
}

export default function RNGSoccerStatistic({ namespace, language, isPopupVisible, togglePopup }: RNGSoccerStatisticProps) {
    return (
        <div className={`${styles['wrapper-popup']} ${isPopupVisible ? styles['active'] : ''}`}>
            <div className={styles['history-block']}>
                <div className={styles['history-block-item']}>
                    <span>Home</span>
                    <span>43%</span>
                </div>
                <div className={styles['history-block-item']}>
                    <span>Draw</span>
                    <span>10%</span>
                </div>
                <div className={styles['history-block-item']}>
                    <span>Away</span>
                    <span>43%</span>
                </div>
            </div>
            <div className={styles['close-popup']} onClick={togglePopup}>
                <img src={closeIcon} alt="close" className={styles['close-icon']} />
            </div>
        </div>
    );
} 