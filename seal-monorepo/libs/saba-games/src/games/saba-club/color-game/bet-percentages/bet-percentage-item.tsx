import React from 'react';
import { Size } from '../../../../_shared/constants';
import { convertValueToSymbol, resultMapper } from '../color-game-utils';
import { BetPercentageItemProps } from './types';
import Styles from './color-game-bet-percentages.module.scss';
import ColorGameDice from '../../../../_shared/components/color-game-dice';
/**
 * Renders a single bet percentage item with symbol and count
 */
const BetPercentageItem: React.FC<BetPercentageItemProps> = ({
    choice,
    count,
    gameName,
    translateBetOption
}) => (
    <div className={Styles['percentage-item']}>
        <ColorGameDice
            symbol={convertValueToSymbol(resultMapper[choice])}
            size={Size.small}
        />
        <span className={Styles.count}>{count}</span>
    </div>
);

export default BetPercentageItem; 