import React from 'react';
import styles from '../../rng-soccer.module.scss';
import TeamCard from './TeamCard';
import GameCard from './GameCard';
import ScoreDisplay from './ScoreDisplay';
import { TeamsData } from '../models/GameResult';
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds';
import Loading from 'libs/hot-league-wall/src/_shared/components/loading';
import type { RNGSoccerResult } from '../../type';

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
                    <GameCard
                        cardData={result?.homeCard}
                        isHomeCard={true}
                        isHidden={shouldHideCards}
                        isAnimating={isAnimationResult}
                    />

                    {/* Score display */}
                    <ScoreDisplay
                        homeScore={result?.homeScore || 0}
                        awayScore={result?.awayScore || 0}
                        isAnimating={isAnimationResult}
                        showDefaultScore={showDefaultScores}
                    />

                    {/* Away card */}
                    <GameCard
                        cardData={result?.awayCard}
                        isHomeCard={false}
                        isHidden={shouldHideCards}
                        isAnimating={isAnimationResult}
                    />
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