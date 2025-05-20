import type { RNGSoccerResult } from '../../type';
import { CardUtils } from '../utils/CardUtils';
import { TeamUtils } from '../utils/TeamUtils';
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
    homeCard: { card: 0, type: 0 },
    awayCard: { card: 0, type: 1 },
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
        if (!result || !result.homeCard || !result.awayCard) {
            return currentTeamData || GameResult.getDefaultTeamData();
        }

        const homeTeamAbbr = CardUtils.getTeamForCard(result.homeCard.card);
        const awayTeamAbbr = CardUtils.getTeamForCard(result.awayCard.card);

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