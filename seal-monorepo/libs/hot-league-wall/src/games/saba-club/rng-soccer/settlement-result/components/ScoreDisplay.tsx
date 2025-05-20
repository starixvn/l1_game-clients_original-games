import React from 'react';
import styles from '../../rng-soccer.module.scss';

interface ScoreDisplayProps {
    homeScore: number;
    awayScore: number;
    isAnimating?: boolean;
    showDefaultScore?: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
    homeScore = 0,
    awayScore = 0,
    isAnimating = false,
    showDefaultScore = false
}) => {
    // Default scores for initial state
    const DEFAULT_HOME_SCORE = 0;
    const DEFAULT_AWAY_SCORE = 0;

    return (
        <div className={styles['result-section']}>
            <div className={`${styles['result']} ${isAnimating ? styles['score-pop-in'] : ''}`}>
                <span>{showDefaultScore ? DEFAULT_HOME_SCORE : homeScore}</span>
            </div>
            <div className={`${styles['result']} ${isAnimating ? styles['score-pop-in'] : ''}`}>
                <span>{showDefaultScore ? DEFAULT_AWAY_SCORE : awayScore}</span>
            </div>
        </div>
    );
};

export default ScoreDisplay; 