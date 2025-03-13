import { sumScore, calculateTotalScore } from './score-utils';

describe('sumScore', () => {
    // Happy path tests
    it('should correctly sum scores for cards less than 10', () => {
        expect(sumScore(0, 0)).toBe(1); // Card 1 (index 0)
        expect(sumScore(5, 3)).toBe(9); // 5 + Card 4 (index 3)
    });

    it('should return original score for cards 10 or greater', () => {
        expect(sumScore(5, 9)).toBe(5); // Card 10 (index 9)
        expect(sumScore(7, 10)).toBe(7); // Card Jack (index 10)
        expect(sumScore(3, 12)).toBe(3); // Card King (index 12)
    });

    it('should handle modulo 10 operation correctly', () => {
        expect(sumScore(8, 4)).toBe(3); // 8 + Card 5 (index 4) = 13 % 10 = 3
        expect(sumScore(9, 8)).toBe(8); // 9 + Card 9 (index 8) = 18 % 10 = 8
    });

    // Edge cases
    it('should handle zero score correctly', () => {
        expect(sumScore(0, 5)).toBe(6); // 0 + Card 6 (index 5)
        expect(sumScore(0, 9)).toBe(0); // 0 + Card 10 (index 9)
    });
});

describe('calculateTotalScore', () => {
    // Happy path tests
    it('should calculate total score for single card', () => {
        const cards = [{ card: 0 }]; // Card 1 (index 0)
        expect(calculateTotalScore(cards)).toBe(1);
    });

    it('should calculate total score for multiple cards', () => {
        const cards = [
            { card: 0 }, // Card 1 (index 0)
            { card: 2 }, // Card 3 (index 2)
            { card: 4 }, // Card 5 (index 4)
        ];
        expect(calculateTotalScore(cards)).toBe(9);
    });

    it('should handle face cards correctly', () => {
        const cards = [
            { card: 9 }, // Card 10 (index 9)
            { card: 10 }, // Jack (index 10)
            { card: 12 }, // King (index 12)
        ];
        expect(calculateTotalScore(cards)).toBe(0);
    });

    // Edge cases
    it('should handle empty card array', () => {
        expect(calculateTotalScore([])).toBe(0);
    });

    it('should handle undefined cards in array', () => {
        const cards = [undefined, { card: 2 }, undefined];
        expect(calculateTotalScore(cards)).toBe(3);
    });

    it('should handle mixed regular and face cards', () => {
        const cards = [
            { card: 2 }, // Card 3 (index 2)
            { card: 9 }, // Card 10 (index 9)
            { card: 4 }, // Card 5 (index 4)
        ];
        expect(calculateTotalScore(cards)).toBe(9);
    });
}); 