import React, { useMemo, useRef } from 'react';
import styles from '../../rng-soccer.module.scss';
import TeamCard, { TeamCardAnimation } from './team-card';
import ScoreDisplay from './score-display';
import { TeamsData } from '../models/game-result';
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds';
import Loading from 'libs/hot-league-wall/src/_shared/components/loading';
import type { RNGSoccerResult } from '../../type';
import { SCORE_MAP } from '../utils/card-score-utils';
import { FlipCard } from 'libs/hot-league-wall/src/_shared/components/card/flip-card/flip-card';
import { CardResult } from 'libs/hot-league-wall/src/_shared/components/card/type';

interface GameDisplayProps {
    result?: RNGSoccerResult;
    teamData: TeamsData;
    roundState: string;
    isFinish: boolean;
    isAnimationResult: boolean;
    isFinishShowResult: boolean;
    isLoading: boolean;
    isHideAllCards: boolean;
}

const useTeamCardAnimation = (roundState: string, teamData: TeamsData) => {
    const prevTeamDataRef = useRef<TeamsData | null>(null);
    
    return useMemo(() => {
        const isTeamChanged = prevTeamDataRef.current && (
            prevTeamDataRef.current.homeTeam.name !== teamData.homeTeam.name ||
            prevTeamDataRef.current.awayTeam.name !== teamData.awayTeam.name
        );
        prevTeamDataRef.current = teamData;

        if (!isTeamChanged) {
            return TeamCardAnimation.NONE;
        }

        if (roundState === ROUND_STATE.STARTING_ROUND) {
            return TeamCardAnimation.POP_OUT;
        }
        if (roundState === ROUND_STATE.PLACING_BET || roundState === ROUND_STATE.LOCKING_BET) {
            return TeamCardAnimation.POP_IN;
        }
        return TeamCardAnimation.NONE;
    }, [roundState, teamData]);
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
    isFinishShowResult,
    isLoading,
    isHideAllCards
}) => {
    if (isLoading) {
        return <Loading />;
    }
    const homeCardData = useMemo(() => {
        const card: CardResult = {
            rank: result?.home?.rank ?? 0,
            suit: result?.home?.suit ?? 0
        };
        const score = SCORE_MAP[card.rank] || 0;
        return { card, score };
    }, [result?.home]);

    const awayCardData = useMemo(() => {
        const card: CardResult = {
            rank: result?.away?.rank ?? 0,
            suit: result?.away?.suit ?? 0
        };
        const score = SCORE_MAP[card.rank] || 0;
        return { card, score };
    }, [result?.away]);

    const shouldHideCards = !isFinish || isHideAllCards ||
        roundState === ROUND_STATE.PLACING_BET ||
        roundState === ROUND_STATE.LOCKING_BET;

    const showDefaultScores = !isFinish || !isFinishShowResult;

    const teamCardAnimation = useTeamCardAnimation(roundState, teamData);

    return (
        <div className={styles['wrapper-sport-middle']}>
            <TeamCard
                logo={teamData.homeTeam.logo}
                isHomeTeam={true}
                animation={teamCardAnimation}
            />

            <div className={styles['sport-result']}>
                <div className={styles['container-result']}>
                    {/* Home card */}
                    <div className={`${styles['card-section']} ${isFinishShowResult && homeCardData.score > awayCardData.score ? styles['winning-card'] : ''}`}>
                        <FlipCard
                            playResultAnimation={isAnimationResult}
                            card={homeCardData.card}
                            isShowResult={!shouldHideCards}
                        />
                    </div>
                    <ScoreDisplay
                        homeScore={homeCardData.score}
                        awayScore={awayCardData.score}
                        showWinningHighlight={isFinishShowResult}
                        showDefaultScore={showDefaultScores}
                    />
                    <div className={`${styles['card-section']} ${isFinishShowResult && awayCardData.score > homeCardData.score ? styles['winning-card'] : ''}`}>
                        <FlipCard
                            playResultAnimation={isAnimationResult}
                            card={awayCardData.card}
                            isShowResult={!shouldHideCards}
                        />
                    </div>
                </div>
            </div>
            <TeamCard
                logo={teamData.awayTeam.logo}
                isHomeTeam={false}
                animation={teamCardAnimation}
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