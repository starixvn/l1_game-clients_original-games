import React from 'react';
import styles from './scoreboard.module.scss';

export function Scoreboard() {
    return (
        <div className={styles.scoreboard}>
            <div className={styles.section}>
                <div className={styles.title}>Current Round</div>
                <div className={styles.info}>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Round ID:</span>
                        <span className={styles.value}>#12345</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Status:</span>
                        <span className={styles.value}>Placing Bets</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Time Left:</span>
                        <span className={styles.value}>30s</span>
                    </div>
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.title}>Statistics</div>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <span className={styles.label}>Total Bets:</span>
                        <span className={styles.value}>1,234</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.label}>Total Wins:</span>
                        <span className={styles.value}>567</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.label}>Win Rate:</span>
                        <span className={styles.value}>45.9%</span>
                    </div>
                </div>
            </div>
        </div>
    );
} 