import cardBack from '../../../../../assets/rng-soccer/cards/card-back.svg';
import cardFrontImg from '../../../../../assets/rng-soccer/cards/card-front.svg';
// Import card images
import a from '../../../../../assets/rng-soccer/cards/A.png';
import aRed from '../../../../../assets/rng-soccer/cards/A-red.png';
import two from '../../../../../assets/rng-soccer/cards/2.png';
import twoRed from '../../../../../assets/rng-soccer/cards/2-red.png';
import three from '../../../../../assets/rng-soccer/cards/3.png';
import threeRed from '../../../../../assets/rng-soccer/cards/3-red.png';
import four from '../../../../../assets/rng-soccer/cards/4.png';
import fourRed from '../../../../../assets/rng-soccer/cards/4-red.png';
import five from '../../../../../assets/rng-soccer/cards/5.png';
import fiveRed from '../../../../../assets/rng-soccer/cards/5-red.png';
import six from '../../../../../assets/rng-soccer/cards/6.png';
import sixRed from '../../../../../assets/rng-soccer/cards/6-red.png';
import seven from '../../../../../assets/rng-soccer/cards/7.png';
import sevenRed from '../../../../../assets/rng-soccer/cards/7-red.png';
import eight from '../../../../../assets/rng-soccer/cards/8.png';
import eightRed from '../../../../../assets/rng-soccer/cards/8-red.png';
import nine from '../../../../../assets/rng-soccer/cards/9.png';
import nineRed from '../../../../../assets/rng-soccer/cards/9-red.png';
import ten from '../../../../../assets/rng-soccer/cards/10.png';
import tenRed from '../../../../../assets/rng-soccer/cards/10-red.png';
import j from '../../../../../assets/rng-soccer/cards/J.png';
import jRed from '../../../../../assets/rng-soccer/cards/J-red.png';
import q from '../../../../../assets/rng-soccer/cards/Q.png';
import qRed from '../../../../../assets/rng-soccer/cards/Q-red.png';
import k from '../../../../../assets/rng-soccer/cards/K.png';
import kRed from '../../../../../assets/rng-soccer/cards/K-red.png';
import { TeamUtils } from './team-utils';

/**
 * Utility class for card operations
 * Following Single Responsibility Principle by separating card logic
 */
export class CardUtils {
    /**
     * Get the image for a specific card
     * @param card The card value (1-13)
     * @param type The card type (0 for black, 1 for red)
     * @returns The image path for the card
     */
    public static getCardImage(card: number, type: number): string {
        // Default to card back if card is 0 or invalid
        if (card <= 0 || card > 13) {
            return cardBack;
        }

        // Ensure type is either 0 (black) or 1 (red)
        const safeType = type === 1 ? 1 : 0;

        // Type: 0 = black (club/spade), 1 = red (heart/diamond)
        // Create a mapping for card values to their images
        const cardImages: Record<number, [string, string]> = {
            1: [a, aRed],
            2: [two, twoRed],
            3: [three, threeRed],
            4: [four, fourRed],
            5: [five, fiveRed],
            6: [six, sixRed],
            7: [seven, sevenRed],
            8: [eight, eightRed],
            9: [nine, nineRed],
            10: [ten, tenRed],
            11: [j, jRed],
            12: [q, qRed],
            13: [k, kRed]
        };

        try {
            // Return the appropriate card image based on type
            if (cardImages[card]) {
                return safeType === 1 ? cardImages[card][1] : cardImages[card][0];
            }
        } catch (e) {
            // Error getting card image
        }

        return cardFrontImg;
    }

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