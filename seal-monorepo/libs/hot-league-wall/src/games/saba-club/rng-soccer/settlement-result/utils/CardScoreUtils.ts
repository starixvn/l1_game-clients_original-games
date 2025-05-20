import { ObjectResult } from 'libs/hot-league-wall/src/_shared/components/card/type';

/**
 * Card scoring utility functions for RNG Soccer
 */
export class CardScoreUtils {
    /**
     * Convert card rank to point value
     * Ace = 1, 2-10 = face value, Jack = 11, Queen = 12, King = 13
     * @param card The card rank (0 = Ace, 1-9 = 2-10, 10 = Jack, 11 = Queen, 12 = King)
     * @returns The point value of the card
     */
    static getCardPointValue(card?: number): number {
        if (card === undefined || card === null) return 0;

        // Convert card rank to point value
        return card === 0 ? 1 : card < 10 ? card + 1 : card + 2;
    }

    /**
     * Calculate score from a card result object
     * @param cardResult The card result object containing card rank
     * @returns The point value of the card
     */
    static calculateScore(cardResult?: ObjectResult): number {
        if (!cardResult) return 0;
        return this.getCardPointValue(cardResult.card);
    }
}

export default CardScoreUtils; 