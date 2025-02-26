import React from 'react';
import { BigRoadPoint } from '../baccarat/big-road/BigRoadHelper';
import styles from './ScoreboardGridItem.module.scss';

interface ScoreboardGridItemProps {
    data: BigRoadPoint<unknown>[];
    x: number;
    y: number;
    status?: boolean;
    ties?: number;
    result?: 'player' | 'banker';
}

export const ScoreboardGridItem: React.FC<ScoreboardGridItemProps> = ({
    data,
    x,
    y,
    status,
    ties = 0,
    result
}) => {
    const hasData = data.length > 0;

    const getCellClass = () => {
        if (!hasData) return styles['empty-cell'];

        const classes = [styles['cell']];
        if (result === 'player') classes.push(styles['player-win']);
        if (result === 'banker') classes.push(styles['banker-win']);
        return classes.join(' ');
    };

    return (
        <div
            className={`${styles['scoreboard-grid-item']} ${getCellClass()}`}
            data-x={x}
            data-y={y}
        >
            {hasData && (
                <div className={styles['cell-content']}>
                    <div className={styles['result-indicator']}>
                        {result === 'player' && 'P'}
                        {result === 'banker' && 'B'}
                    </div>
                    {ties > 0 && (
                        <div className={styles['tie-indicators']}>
                            {[...Array(ties)].map((_, i) => (
                                <div key={i} className={styles['tie-dot']} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}; 