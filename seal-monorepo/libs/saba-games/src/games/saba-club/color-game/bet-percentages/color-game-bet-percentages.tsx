import { Translator } from '@sg/sg-game-client';
import React from 'react';
import { ColorGameChoices } from '../type';
import { BetPercentagesProps } from './types';
import { calculateBetStatistics } from './utils';
import Styles from './color-game-bet-percentages.module.scss';
import BetPercentageItem from './bet-percentage-item';

/**
 * Displays bet percentages for Color game
 */
const ColorGameBetPercentages: React.FC<BetPercentagesProps> = ({
    gameName,
    rounds,
    translator = (key: string) => Translator.t(`${gameName}.glossary_${key}`),
}) => {
    const betCounts = calculateBetStatistics(rounds);
    const choices = Object.values(ColorGameChoices);

    return (
        <div className={Styles['fpc-percentages']}>
            {choices.map((choice) => (
                <BetPercentageItem
                    key={choice}
                    gameName={gameName}
                    count={betCounts[choice as keyof typeof betCounts]}
                    translateBetOption={translator}
                    choice={choice as ColorGameChoices}
                />
            ))}
        </div>
    );
};

export default ColorGameBetPercentages; 