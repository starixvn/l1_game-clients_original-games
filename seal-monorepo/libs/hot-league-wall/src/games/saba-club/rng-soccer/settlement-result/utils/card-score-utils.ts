import { CardResult } from "../../../../../_shared/components/card/type";


/**
 * Card scoring utility functions for RNG Soccer
 */
export class CardScoreUtils {
    /**
     * Convert card rank to point value based on the index in RANKS array
     * Ace (index 0) = 1, 2 (index 1) = 2, ..., King (index 12) = 13
     * @param card The card rank (0 to 12, representing A to K)
     * @returns The point value of the card (position in RANKS array + 1)
     */
    static getCardPointValue(card?: number): number {
        if (card === undefined || card === null) return 0;

        // Card value is index in RANKS + 1 (so Ace=1, 2=2, ..., King=13)
        return card + 1;
    }

    /**
     * Calculate score from a card result object using rank position
     * @param cardResult The card result object containing card rank
     * @returns The point value of the card based on RANKS array position
     */
    static calculateScore(cardResult?: CardResult): number {
        if (!cardResult) return 0;
        return this.getCardPointValue(cardResult.rank);
    }
}

export default CardScoreUtils; 