import React from 'react';
import styles from '../../rng-soccer.module.scss';

interface ScoreDisplayProps {
    homeScore: number;
    awayScore: number;
    showWinningHighlight?: boolean;
    showDefaultScore?: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
    homeScore = 0,
    awayScore = 0,
    showWinningHighlight = false,
    showDefaultScore = false
}) => {
    const DEFAULT_HOME_SCORE = 0;
    const DEFAULT_AWAY_SCORE = 0;

    const homeScoreValue = showDefaultScore ? DEFAULT_HOME_SCORE : homeScore;
    const awayScoreValue = showDefaultScore ? DEFAULT_AWAY_SCORE : awayScore;
    const isHomeHigher = homeScoreValue > awayScoreValue;
    const isAwayHigher = awayScoreValue > homeScoreValue;

    return (
        <div className={styles['result-section']}>
            <div className={`${styles['result']} ${isHomeHigher && showWinningHighlight ? styles['higher-score'] : ''}`}>
                <span>{showDefaultScore? "" :homeScoreValue}</span>
            </div>
            <div className={`${styles['result']} ${isAwayHigher && showWinningHighlight ? styles['higher-score'] : ''}`}>
                <span>{showDefaultScore ? "" : awayScoreValue}</span>
            </div>
        </div>
    );
};

export default ScoreDisplay; 