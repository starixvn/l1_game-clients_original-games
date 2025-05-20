import React from 'react';
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds';
import classnames from 'classnames';
import styles from './rng-soccer-round-id.module.scss';

export interface IRngSoccerRoundIdProps {
    roundNumber: number;
    roundState?: string;
}

export const RngSoccerRoundId: React.FC<IRngSoccerRoundIdProps> = ({ roundNumber, roundState }) => {
    // Make sure roundNumber is valid before rendering
    const isValidRoundNumber = roundNumber && roundNumber !== 0;
    const showRoundId = isValidRoundNumber && roundState;

    const getRoundStateClass = () => {
        if (!roundState) return '';

        const { PLACING_BET, LOCKING_BET, SHOW_ANIMATION_RESULT, SHOW_RESULT, STOP_GAME_LOOP } = ROUND_STATE;

        if (roundState === PLACING_BET) {
            return styles['placing-bet-state'];
        }

        if (roundState === LOCKING_BET) {
            return styles['no-more-bet-state'];
        }

        if ([SHOW_ANIMATION_RESULT, SHOW_RESULT, STOP_GAME_LOOP].includes(roundState as string)) {
            return styles['result-state'];
        }

        return '';
    };

    return (
        showRoundId && (
            <div className={classnames(styles['game-name-round'], getRoundStateClass())}>
                #{roundNumber}
            </div>
        )
    );
}; 