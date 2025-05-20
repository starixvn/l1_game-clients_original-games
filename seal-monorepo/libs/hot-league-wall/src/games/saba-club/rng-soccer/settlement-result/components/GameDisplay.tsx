import React, { useMemo } from 'react';
import styles from '../../rng-soccer.module.scss';
import TeamCard from './TeamCard';
import ScoreDisplay from './ScoreDisplay';
import { TeamsData } from '../models/GameResult';
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds';
import Loading from 'libs/hot-league-wall/src/_shared/components/loading';
import type { RNGSoccerResult } from '../../type';
import Card from 'libs/hot-league-wall/src/_shared/components/card';
import cardBack from '../../../../../assets/rng-soccer/cards/card-back.svg';

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
 * Convert card rank to point value
 * Ace = 1, 2-10 = face value, Jack = 11, Queen = 12, King = 13
 */
const getCardPointValue = (card?: number): number => {
    if (!card && card !== 0) return 0;

    // Convert card rank to point value (0 = Ace, 1-9 = 2-10, 10 = Jack, 11 = Queen, 12 = King)
    return card === 0 ? 1 : card < 10 ? card + 1 : card + 2;
};

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
    const homeScore = useMemo(() => getCardPointValue(result?.home?.card), [result?.home?.card]);
    const awayScore = useMemo(() => getCardPointValue(result?.away?.card), [result?.away?.card]);

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