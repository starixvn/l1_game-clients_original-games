import type { RNGSoccerResult } from '../../type';
import { CardUtils } from '../utils/card-utils';
import { TeamUtils } from '../utils/team-utils';
import homeDefaultLogo from '../../../../../assets/rng-soccer/home-default-logo.svg';
import awayDefaultLogo from '../../../../../assets/rng-soccer/away-default-logo.svg';

/**
 * Team data structure
 */
export interface TeamData {
    name: string;
    logo: string;
    color: string;
}

/**
 * Game teams data structure
 */
export interface TeamsData {
    homeTeam: TeamData;
    awayTeam: TeamData;
}

/**
 * Default result values
 */
export const DEFAULT_RESULT: RNGSoccerResult = {
    homeScore: 0,
    awayScore: 0,
    home: { card: 0, suit: 0 },
    away: { card: 0, suit: 1 },
};

/**
 * Game result model to handle result data
 * Following the Single Responsibility Principle
 */
export class GameResult {
    /**
     * Get default team data
     * @param homeTeamAbbr Home team abbreviation
     * @param awayTeamAbbr Away team abbreviation
     * @returns Team data object
     */
    public static getDefaultTeamData(
        homeTeamAbbr: string = "MCI",
        awayTeamAbbr: string = "ARS"
    ): TeamsData {
        return {
            homeTeam: {
                name: TeamUtils.getTeamFullName(homeTeamAbbr),
                logo: homeDefaultLogo,
                color: TeamUtils.getTeamPrimaryColor(homeTeamAbbr)
            },
            awayTeam: {
                name: TeamUtils.getTeamFullName(awayTeamAbbr),
                logo: awayDefaultLogo,
                color: TeamUtils.getTeamPrimaryColor(awayTeamAbbr)
            }
        };
    }

    /**
     * Update team data based on game result
     * @param result The game result
     * @param currentTeamData Current team data (optional)
     * @returns Updated team data
     */
    public static updateTeamData(
        result: RNGSoccerResult,
        currentTeamData?: TeamsData
    ): TeamsData {
        if (!result || !result.home || !result.away) {
            return currentTeamData || GameResult.getDefaultTeamData();
        }

        const homeTeamAbbr = CardUtils.getTeamForCard(result.home.card);
        const awayTeamAbbr = CardUtils.getTeamForCard(result.away.card);

        return {
            homeTeam: {
                name: TeamUtils.getTeamFullName(homeTeamAbbr),
                logo: homeDefaultLogo,
                color: TeamUtils.getTeamPrimaryColor(homeTeamAbbr)
            },
            awayTeam: {
                name: TeamUtils.getTeamFullName(awayTeamAbbr),
                logo: awayDefaultLogo,
                color: TeamUtils.getTeamPrimaryColor(awayTeamAbbr)
            }
        };
    }
} 