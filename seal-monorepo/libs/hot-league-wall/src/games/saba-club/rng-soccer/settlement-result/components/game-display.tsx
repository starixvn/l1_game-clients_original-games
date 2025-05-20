import React, { useMemo } from 'react';
import styles from '../../rng-soccer.module.scss';
import TeamCard from './team-card';
import ScoreDisplay from './score-display';
import { TeamsData } from '../models/game-result';
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds';
import Loading from 'libs/hot-league-wall/src/_shared/components/loading';
import type { RNGSoccerResult } from '../../type';
import Card from 'libs/hot-league-wall/src/_shared/components/card';
import cardBack from '../../../../../assets/rng-soccer/cards/card-back.svg';
import { CardScoreUtils } from '../utils/card-score-utils';

interface GameDisplayProps {
    result?: RNGSoccerResult;
    teamData: TeamsData;
    roundState: string;
    isFinish: boolean;
    isAnimationResult: boolean;
    isLoading: boolean;
    isHideAllCards: boolean;
}

/**
 * Main game display component
 * Following the Open/Closed principle by using composition over inheritance
 */
export const GameDisplay: React.FC<GameDisplayProps> = ({
    result,
    teamData,
    roundState,
    isFinish,
    isAnimationResult,
    isLoading,
    isHideAllCards
}) => {
    if (isLoading) {
        return <Loading />;
    }

    // Calculate scores based on card ranks
    const homeScore = useMemo(() => CardScoreUtils.calculateScore(result?.home), [result?.home]);
    const awayScore = useMemo(() => CardScoreUtils.calculateScore(result?.away), [result?.away]);

    // Calculate if we should hide cards or show default results
    const shouldHideCards = !isFinish || isHideAllCards ||
        roundState === ROUND_STATE.PLACING_BET ||
        roundState === ROUND_STATE.LOCKING_BET;

    const showDefaultScores = !isFinish ||
        roundState === ROUND_STATE.PLACING_BET ||
        roundState === ROUND_STATE.LOCKING_BET;

    return (
        <div className={styles['wrapper-sport-middle']}>
            {/* Home Team */}
            <TeamCard
                name={teamData.homeTeam.name}
                logo={teamData.homeTeam.logo}
                color={teamData.homeTeam.color}
                isHomeTeam={true}
            />

            {/* Game Result Display */}
            <div className={styles['sport-result']}>
                <div className={styles['container-result']}>
                    {/* Home card */}
                    <div className={styles['card-section']}>
                        {shouldHideCards || !result?.home ? (
                            <img src={cardBack} alt="card" />
                        ) : (
                            <Card
                                result={result.home}
                                isAnimation={isAnimationResult}
                                customClassName={`${isAnimationResult ? 'card-flip' : ''}`}
                            />
                        )}
                    </div>

                    {/* Score display */}
                    <ScoreDisplay
                        homeScore={homeScore}
                        awayScore={awayScore}
                        isAnimating={isAnimationResult}
                        showDefaultScore={showDefaultScores}
                    />

                    {/* Away card */}
                    <div className={styles['card-section']}>
                        {shouldHideCards || !result?.away ? (
                            <img src={cardBack} alt="card" />
                        ) : (
                            <Card
                                result={result.away}
                                isAnimation={isAnimationResult}
                                customClassName={`${isAnimationResult ? 'card-flip' : ''}`}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Away Team */}
            <TeamCard
                name={teamData.awayTeam.name}
                logo={teamData.awayTeam.logo}
                color={teamData.awayTeam.color}
                isHomeTeam={false}
            />
        </div>
    );
};

export default GameDisplay; 