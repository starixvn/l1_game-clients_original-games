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
    const DEFAULT_HOME_SCORE = 0;
    const DEFAULT_AWAY_SCORE = 0;

    const homeScoreValue = showDefaultScore ? DEFAULT_HOME_SCORE : homeScore;
    const awayScoreValue = showDefaultScore ? DEFAULT_AWAY_SCORE : awayScore;
    const isHomeHigher = homeScoreValue > awayScoreValue;
    const isAwayHigher = awayScoreValue > homeScoreValue;
    const shouldAnimate = isAnimating || showDefaultScore;

    return (
        <div className={styles['result-section']}>
            <div className={`${styles['result']} ${shouldAnimate ? styles['score-pop-in'] : ''} ${isHomeHigher ? styles['higher-score'] : ''}`}>
                <span>{homeScoreValue}</span>
            </div>
            <div className={`${styles['result']} ${shouldAnimate ? styles['score-pop-in'] : ''} ${isAwayHigher ? styles['higher-score'] : ''}`}>
                <span>{awayScoreValue}</span>
            </div>
        </div>
    );
};

export default ScoreDisplay; 