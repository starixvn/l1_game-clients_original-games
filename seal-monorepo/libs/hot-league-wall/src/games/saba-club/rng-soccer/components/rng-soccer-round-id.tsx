import React from 'react';
import styles from './rng-soccer-round-id.module.scss';

export interface IRngSoccerRoundIdProps {
    roundNumber: number;
    roundState?: string;
}

export const RngSoccerRoundId: React.FC<IRngSoccerRoundIdProps> = ({ roundNumber, roundState }) => {
    const showRoundId = roundNumber !== 0 && roundState;

    return (
        showRoundId && (
            <div className={styles['game-name-round']}>
                #{roundNumber}
            </div>
        )
    );
}; 