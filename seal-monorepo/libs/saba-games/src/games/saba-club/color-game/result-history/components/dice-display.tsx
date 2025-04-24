import React from 'react';
import * as gc from '@sg/sg-game-client';
import ColorGameDice from '../../../../../_shared/components/color-game-dice';
import { Size } from '../../../../../_shared/constants';
import styles from '../color-game-result-history.module.scss';

interface IDiceDisplayProps {
    result: gc.RoundHistories.RoundHistory['result'];
}

export const DiceDisplay: React.FC<IDiceDisplayProps> = ({ result }) => {
    if (!result) return null;

    return (
        <div className={styles['dice-container']}>
            <ColorGameDice
                symbol={result["dice1"]}
                size={Size.small}
            />
            <ColorGameDice
                symbol={result["dice2"]}
                size={Size.small}
            />
            <ColorGameDice
                symbol={result["dice3"]}
                size={Size.small}
            />
        </div>
    );
}; 