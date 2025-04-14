import React from 'react';
import { FishPrawnCrabChoices } from '../type';
import styles from './round-history.module.scss';

interface Props {
    namespace: string;
    language: string;
}

export default function FishPrawnCrabRoundHistory({ namespace, language }: Props) {
    return (
        <div className={styles.roundHistory}>
            <div className={styles.title}>Round History</div>
            <div className={styles.content}>
                <div className={styles.historyList}>
                    {Object.values(FishPrawnCrabChoices).map((choice) => (
                        <div key={choice} className={styles.historyItem}>
                            <div className={styles.symbol}>{choice}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 