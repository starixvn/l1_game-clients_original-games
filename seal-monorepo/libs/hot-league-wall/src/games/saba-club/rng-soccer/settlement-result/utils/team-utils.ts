/**
 * Team information interface
 */
export interface TeamInfo {
    fullName: string;
    shortName: string;
    primaryColor: string;
    secondaryColor: string;
}

/**
 * Utility class for team operations
 * Following Single Responsibility Principle by separating team logic
 */
export class TeamUtils {
    /**
     * Team mapping with team information
     */
    public static readonly TEAM_INFO: Record<string, TeamInfo> = {
        "LIV": { fullName: "Liverpool", shortName: "Liverpool", primaryColor: "#C8102E", secondaryColor: "#00B2A9" },
        "INT": { fullName: "Inter Milan", shortName: "Inter", primaryColor: "#0066B3", secondaryColor: "#000000" },
        "BAR": { fullName: "Barcelona", shortName: "Barca", primaryColor: "#CD122D", secondaryColor: "#004D98" },
        "PSG": { fullName: "Paris Saint-Germain", shortName: "PSG", primaryColor: "#004170", secondaryColor: "#DA291C" },
        "ARS": { fullName: "Arsenal", shortName: "Arsenal", primaryColor: "#EF0107", secondaryColor: "#063672" },
        "BAY": { fullName: "Bayern Munich", shortName: "Bayern", primaryColor: "#DC052D", secondaryColor: "#0066B2" },
        "RMA": { fullName: "Real Madrid", shortName: "Real", primaryColor: "#FFFFFF", secondaryColor: "#00529F" },
        "LEV": { fullName: "Bayer Leverkusen", shortName: "Leverkusen", primaryColor: "#E32221", secondaryColor: "#000000" },
        "ATM": { fullName: "Atletico Madrid", shortName: "Atletico", primaryColor: "#CB3524", secondaryColor: "#172E62" },
        "MCI": { fullName: "Manchester City", shortName: "Man.City", primaryColor: "#6CABDD", secondaryColor: "#1C2C5B" },
        "ATA": { fullName: "Atalanta", shortName: "Atalanta", primaryColor: "#1E71B8", secondaryColor: "#000000" },
        "NAP": { fullName: "Napoli", shortName: "Napoli", primaryColor: "#12A0D7", secondaryColor: "#003C8F" },
        "ATH": { fullName: "Athletico Bilbao", shortName: "Bilbao", primaryColor: "#EF1420", secondaryColor: "#000000" },
        "AVL": { fullName: "Aston Villa", shortName: "A.Villa", primaryColor: "#95BFE5", secondaryColor: "#7A003C" },
        "BEN": { fullName: "Benfica", shortName: "Benfica", primaryColor: "#E73331", secondaryColor: "#FFFFFF" },
        "SPO": { fullName: "Sporting", shortName: "Sporting", primaryColor: "#006335", secondaryColor: "#FFFFFF" },
        "NFO": { fullName: "Nottingham Forest", shortName: "N.Forest", primaryColor: "#DD0000", secondaryColor: "#FFFFFF" },
        "BOL": { fullName: "Bologna", shortName: "Bologna", primaryColor: "#1A2F48", secondaryColor: "#AB1F3A" },
        "ROM": { fullName: "AS Roma", shortName: "Roma", primaryColor: "#A31D21", secondaryColor: "#FFD700" },
        "JUV": { fullName: "Juventus", shortName: "Juventus", primaryColor: "#000000", secondaryColor: "#FFFFFF" }
    };

    /**
     * Team abbreviation array for easier reference
     */
    public static readonly TEAMS = Object.keys(TeamUtils.TEAM_INFO);

    /**
     * Get team name from the abbreviation
     * @param abbreviation The team abbreviation
     * @returns The team short name
     */
    public static getTeamFullName(abbreviation: string): string {
        return TeamUtils.TEAM_INFO[abbreviation]?.shortName || abbreviation;
    }

    /**
     * Get team primary color
     * @param abbreviation The team abbreviation
     * @returns The team primary color
     */
    public static getTeamPrimaryColor(abbreviation: string): string {
        return TeamUtils.TEAM_INFO[abbreviation]?.primaryColor || '#FFFFFF';
    }
} 