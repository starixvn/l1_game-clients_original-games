import React from 'react';
import * as gc from '@sg/sg-game-client';
import Styles from './rng-soccer-animations.module.scss';
import { CardScoreUtils } from './utils/card-score-utils';
import type { RNGSoccerResult } from '../type';

interface ResultDisplayProps {
    result?: RNGSoccerResult;
    winningSymbols?: string[];
    namespace?: string;
    language?: string;
    teamData?: {
        homeTeam: { name: string; color?: string; };
        awayTeam: { name: string; color?: string; };
    };
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
    result,
    winningSymbols = [],
    namespace = 'rng_soccer',
    language = 'en',
    teamData
}) => {
    const translate = (key: string) => gc.Translator.translate(key, { languageId: language });

    // Calculate scores using our simplified approach with SCORE_MAP
    const homeScore = result?.home ? CardScoreUtils.calculateScore(result.home) : 0;
    const awayScore = result?.away ? CardScoreUtils.calculateScore(result.away) : 0;

    return (
        <div className={Styles['rng-soccer-result']}>
            {/* Display Team Names and Scores */}
            <div className={Styles['score-display']}>
                <div
                    className={Styles['team-name']}
                    style={{ color: teamData?.homeTeam.color || '#fff' }}
                >
                    {teamData?.homeTeam.name || 'Home'}
                </div>
                <div className={Styles['score']}>
                    {homeScore} - {awayScore}
                </div>
                <div
                    className={Styles['team-name']}
                    style={{ color: teamData?.awayTeam.color || '#fff' }}
                >
                    {teamData?.awayTeam.name || 'Away'}
                </div>
            </div>

            {/* Display Winning Symbols if needed */}
            {winningSymbols.length > 0 && (
                <div className={Styles['winning-symbols']}>
                    {winningSymbols.map((symbol, index) => (
                        <div key={index} className={Styles['result-item']}>
                            {translate(`${namespace}.result.${symbol}`)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}; 