import React from 'react';
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds';
import classnames from 'classnames';
import Styles from './round-id.module.scss';
import gameStyles from './game-round-id.module.scss';

export interface IRoundIdProps {
    clientRoundId: number;
    roundState?: string;
    className?: string;
    useGameStyling?: boolean;
}

export const RoundId: React.FC<IRoundIdProps> = ({ clientRoundId, roundState, className, useGameStyling }) => {
    // Make sure roundNumber is valid before rendering
    const isValidRoundNumber = clientRoundId && clientRoundId !== 0;
    const showRoundId = isValidRoundNumber && roundState;

    const getRoundStateClass = () => {
        if (!roundState) return '';

        const { PLACING_BET, LOCKING_BET, SHOW_ANIMATION_RESULT, SHOW_RESULT, STOP_GAME_LOOP } = ROUND_STATE;

        if (useGameStyling) {
            if (roundState === PLACING_BET) {
                return gameStyles['placing-bet-state'];
            }

            if (roundState === LOCKING_BET) {
                return gameStyles['no-more-bet-state'];
            }

            if ([SHOW_ANIMATION_RESULT, SHOW_RESULT, STOP_GAME_LOOP].includes(roundState)) {
                return gameStyles['result-state'];
            }
        }

        return '';
    };

    if (!showRoundId) return null;

    if (useGameStyling) {
        return (
            <div className={classnames(gameStyles['game-round-id'], getRoundStateClass(), className)}>
                #{clientRoundId}
            </div>
        );
    }

    return (
        <div className={classnames(Styles['round-id'], className)}>
            #{clientRoundId}
        </div>
    );
}
