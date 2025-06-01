import React, { useMemo } from 'react';
import styles from '../../rng-soccer.module.scss';
import TeamCard from './team-card';
import ScoreDisplay from './score-display';
import { TeamsData } from '../models/game-result';
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds';
import Loading from 'libs/hot-league-wall/src/_shared/components/loading';
import type { RNGSoccerResult } from '../../type';
import Card from 'libs/hot-league-wall/src/_shared/components/card';
import cardBack from '../../../../../assets/cards/card-back.svg';
import { SCORE_MAP } from '../utils/card-score-utils';

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

    // Calculate scores directly using SCORE_MAP for more efficient lookup
    const homeScore = useMemo(() => {
        if (!result?.home || result.home.rank === undefined) return 0;
        return SCORE_MAP[result.home.rank] || 0;
    }, [result?.home]);

    const awayScore = useMemo(() => {
        if (!result?.away || result.away.rank === undefined) return 0;
        return SCORE_MAP[result.away.rank] || 0;
    }, [result?.away]);

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
                logo={teamData.homeTeam.logo}
                isHomeTeam={true}
            />

            {/* Game Result Display */}
            <div className={styles['sport-result']}>
                <div className={styles['container-result']}>
                    {/* Home card */}
                    <div className={`${styles['card-section']} ${!showDefaultScores && homeScore > awayScore ? styles['winning-card'] : ''}`}>
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
                    <div className={`${styles['card-section']} ${!showDefaultScores && awayScore > homeScore ? styles['winning-card'] : ''}`}>
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
                logo={teamData.awayTeam.logo}
                isHomeTeam={false}
            />

            <div className={styles['wrapper-team-name']}>
                <div className={styles['name']}>
                    {teamData.homeTeam.name}
                </div>
                <div className={styles['name']}>
                    {teamData.awayTeam.name}
                </div>
            </div>
        </div>
    );
};

export default GameDisplay; 