import { CardScoreUtils } from '../../../../../../src/games/saba-club/rng-soccer/settlement-result/utils/card-score-utils';
import { ObjectResult } from '../../../../../../src/_shared/components/card/type';

describe('CardScoreUtils', () => {
    describe('getCardPointValue', () => {
        it('should return 0 for undefined or null input', () => {
            expect(CardScoreUtils.getCardPointValue(undefined)).toBe(0);
            expect(CardScoreUtils.getCardPointValue(null as unknown as number)).toBe(0);
        });

        it('should return 1 for Ace (0)', () => {
            expect(CardScoreUtils.getCardPointValue(0)).toBe(1);
        });

        it('should return face value for numbered cards (2-10)', () => {
            expect(CardScoreUtils.getCardPointValue(1)).toBe(2); // 2
            expect(CardScoreUtils.getCardPointValue(2)).toBe(3); // 3
            expect(CardScoreUtils.getCardPointValue(3)).toBe(4); // 4
            expect(CardScoreUtils.getCardPointValue(4)).toBe(5); // 5
            expect(CardScoreUtils.getCardPointValue(5)).toBe(6); // 6
            expect(CardScoreUtils.getCardPointValue(6)).toBe(7); // 7
            expect(CardScoreUtils.getCardPointValue(7)).toBe(8); // 8
            expect(CardScoreUtils.getCardPointValue(8)).toBe(9); // 9
            expect(CardScoreUtils.getCardPointValue(9)).toBe(10); // 10
        });

        it('should return correct values for face cards', () => {
            expect(CardScoreUtils.getCardPointValue(10)).toBe(11); // Jack (10 + 1)
            expect(CardScoreUtils.getCardPointValue(11)).toBe(12); // Queen (11 + 1)
            expect(CardScoreUtils.getCardPointValue(12)).toBe(13); // King (12 + 1)
        });
    });

    describe('calculateScore', () => {
        it('should return 0 for undefined or null input', () => {
            expect(CardScoreUtils.calculateScore(undefined)).toBe(0);
            expect(CardScoreUtils.calculateScore(null as unknown as ObjectResult)).toBe(0);
        });

        it('should calculate scores correctly from card objects', () => {
            // Ace of Hearts
            const aceOfHearts: ObjectResult = { card: 0, suit: 1 };
            expect(CardScoreUtils.calculateScore(aceOfHearts)).toBe(1);

            // 5 of Clubs
            const fiveOfClubs: ObjectResult = { card: 4, suit: 0 };
            expect(CardScoreUtils.calculateScore(fiveOfClubs)).toBe(5);

            // 10 of Diamonds
            const tenOfDiamonds: ObjectResult = { card: 9, suit: 2 };
            expect(CardScoreUtils.calculateScore(tenOfDiamonds)).toBe(10);

            // King of Spades
            const kingOfSpades: ObjectResult = { card: 12, suit: 3 };
            expect(CardScoreUtils.calculateScore(kingOfSpades)).toBe(13);
        });
    });
}); 