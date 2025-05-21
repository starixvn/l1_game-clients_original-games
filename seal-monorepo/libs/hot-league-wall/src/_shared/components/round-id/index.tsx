import React from 'react';
import classnames from 'classnames';
import Styles from './round-id.module.scss';

export interface IRoundIdProps {
    clientRoundId: number;
    roundState?: string;
    className?: string;
}

export const RoundId: React.FC<IRoundIdProps> = ({ clientRoundId, roundState, className }) => {
    const isValidRoundNumber = clientRoundId && clientRoundId !== 0;
    const showRoundId = isValidRoundNumber && roundState;

    if (!showRoundId) return null;

    return (
        <div className={classnames(Styles['round-id'], className)}>
            #{clientRoundId}
        </div>
    );
}
