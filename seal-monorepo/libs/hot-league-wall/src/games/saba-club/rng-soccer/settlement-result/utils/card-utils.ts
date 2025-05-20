import { TeamUtils } from './team-utils';

/**
 * Utility class for card operations
 * Following Single Responsibility Principle by separating card logic
 */
export class CardUtils {
    /**
     * Get the team associated with a specific card
     * @param card The card value
     * @returns The team abbreviation
     */
    public static getTeamForCard(card: number): string {
        // Ensure the card value is between 1-13 (standardized playing card values)
        // Map to a team from the TEAMS array using modulo to handle any card value
        const teamIndex = (card - 1) % TeamUtils.TEAMS.length;
        return TeamUtils.TEAMS[teamIndex];
    }
} 