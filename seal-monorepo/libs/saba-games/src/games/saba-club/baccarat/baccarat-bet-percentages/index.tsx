import { Translator } from '@sg/sg-game-client';
import * as gc from '@sg/sg-game-client';
import React from 'react';

import bankerPairBeadImage from '../../../../assets/baccarat/scoreboard/indicator/banker-pair-bead.png';
import playerPairBeadImage from '../../../../assets/baccarat/scoreboard/indicator/player-pair-bead.png';
import Styles from './baccarat-bet-percentages.module.scss';
import { BaccaratDot } from '../dot/baccarat-dot';
import { Choices } from '../baccarat-helper';

// Image assets
// Constants for image mapping
const pairImages: Record<string, string> = {
    playerPair: playerPairBeadImage,
    bankerPair: bankerPairBeadImage,
};

// Types and Interfaces
interface BetResult {
    player: boolean;
    banker: boolean;
    tie: boolean;
    playerPair: boolean;
    bankerPair: boolean;
}

interface BetCounts {
    player: number;
    banker: number;
    tie: number;
    playerPair: number;
    bankerPair: number;
}

interface BetDisplayConfig {
    key: keyof BetCounts;
    indicator: string;
    className: string;
}

interface Props {
    gameName: string;
    rounds: gc.RoundHistories.RoundHistory[];
    translator?: (key: string) => string;
    language?: string;
}

// Pure function for calculating bet statistics
const calculateBetStatistics = (data: gc.RoundHistories.RoundHistory[]): BetCounts => {
    const initialCounts: BetCounts = {
        player: 0,
        banker: 0,
        tie: 0,
        playerPair: 0,
        bankerPair: 0,
    };

    return data.reduce((counts, item) => {
        if (!item.settlementResult) return counts;

        const result = item.settlementResult as unknown as BetResult;
        return {
            player: counts.player + (result.player ? 1 : 0),
            banker: counts.banker + (result.banker ? 1 : 0),
            tie: counts.tie + (result.tie ? 1 : 0),
            playerPair: counts.playerPair + (result.playerPair ? 1 : 0),
            bankerPair: counts.bankerPair + (result.bankerPair ? 1 : 0),
        };
    }, initialCounts);
};

const BET_DISPLAY_CONFIG: BetDisplayConfig[] = [
    { key: 'player', indicator: 'P', className: 'player' },
    { key: 'banker', indicator: 'B', className: 'banker' },
    { key: 'tie', indicator: 'T', className: 'tie' },
    { key: 'playerPair', indicator: 'P', className: 'player-pair' },
    { key: 'bankerPair', indicator: 'B', className: 'banker-pair' },
];

const BetPercentageItem: React.FC<{
    config: BetDisplayConfig;
    count: number;
    translateBetOption: (option: string) => string;
}> = ({ config, count, translateBetOption }) => (
    <div className={Styles['percentage-item']}>
        {[Choices.player, Choices.banker, Choices.tie].includes(config.key) ? (
            <BaccaratDot choice={config.key} value={config.indicator} />
        ) : (
            <span className={`${Styles.indicator} ${Styles[config.className]}`}>
                <img src={pairImages[config.key]} alt={config.indicator} width="16" height="16" />
            </span>
        )}

        {translateBetOption(config.key)}
        <span className={Styles.count}>{count}</span>
    </div>
);

const BaccaratBetPercentages: React.FC<Props> = ({
    gameName,
    rounds,
    translator = (key: string) => Translator.t(`${gameName}.glossary_${key}`),
}) => {
    const betCounts = calculateBetStatistics(rounds);

    return (
        <div className={Styles['baccarat-percentages']}>
            {BET_DISPLAY_CONFIG.map((config) => (
                <BetPercentageItem key={config.key} config={config} count={betCounts[config.key]} translateBetOption={translator} />
            ))}
        </div>
    );
};

export { BaccaratBetPercentages, calculateBetStatistics, type BetCounts, type BetResult };
