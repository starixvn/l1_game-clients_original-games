import { calculateTotalScore, sumScore } from './score-utils';

describe('sumScore', () => {
    // Individual card rank tests
    describe('number cards (Ace through 9)', () => {
        it('should handle Ace through 5 correctly', () => {
            expect(sumScore(0, 0)).toBe(1);  // Ace = 1
            expect(sumScore(0, 1)).toBe(2);  // 2
            expect(sumScore(0, 2)).toBe(3);  // 3
            expect(sumScore(0, 3)).toBe(4);  // 4
            expect(sumScore(0, 4)).toBe(5);  // 5
        });

        it('should handle 6 through 9 correctly', () => {
            expect(sumScore(0, 5)).toBe(6);  // 6
            expect(sumScore(0, 6)).toBe(7);  // 7
            expect(sumScore(0, 7)).toBe(8);  // 8
            expect(sumScore(0, 8)).toBe(9);  // 9
        });
    });

    describe('face cards (10, J, Q, K)', () => {
        it('should handle all face cards as zero', () => {
            expect(sumScore(0, 9)).toBe(0);   // 10 = 0
            expect(sumScore(0, 10)).toBe(0);  // Jack = 0
            expect(sumScore(0, 11)).toBe(0);  // Queen = 0
            expect(sumScore(0, 12)).toBe(0);  // King = 0
        });

        it('should maintain existing score with face cards', () => {
            expect(sumScore(5, 9)).toBe(5);   // 5 + 10(0) = 5
            expect(sumScore(7, 10)).toBe(7);  // 7 + Jack(0) = 7
            expect(sumScore(3, 11)).toBe(3);  // 3 + Queen(0) = 3
            expect(sumScore(8, 12)).toBe(8);  // 8 + King(0) = 8
        });
    });

    // Progressive sum tests with different ranks
    describe('progressive sums with number cards', () => {
        it('should handle ascending sequences', () => {
            let score = 0;
            score = sumScore(score, 0);  // 0 -> 1 (Ace)
            expect(score).toBe(1);
            score = sumScore(score, 1);  // 1 + 2 = 3
            expect(score).toBe(3);
            score = sumScore(score, 2);  // 3 + 3 = 6
            expect(score).toBe(6);
            score = sumScore(score, 3);  // 6 + 4 = 0
            expect(score).toBe(0);
        });

        it('should handle descending sequences', () => {
            let score = 0;
            score = sumScore(score, 8);  // 0 + 9 = 9
            expect(score).toBe(9);
            score = sumScore(score, 7);  // 9 + 8 = 7
            expect(score).toBe(7);
            score = sumScore(score, 6);  // 7 + 7 = 4
            expect(score).toBe(4);
        });
    });

    describe('combinations with face cards', () => {
        it('should handle number card followed by face cards', () => {
            let score = 0;
            score = sumScore(score, 4);   // 0 + 5 = 5
            expect(score).toBe(5);
            score = sumScore(score, 9);   // 5 + 0 = 5 (10)
            expect(score).toBe(5);
            score = sumScore(score, 10);  // 5 + 0 = 5 (Jack)
            expect(score).toBe(5);
        });

        it('should handle face cards followed by number cards', () => {
            let score = 0;
            score = sumScore(score, 12);  // 0 + 0 = 0 (King)
            expect(score).toBe(0);
            score = sumScore(score, 3);   // 0 + 4 = 4
            expect(score).toBe(4);
            score = sumScore(score, 11);  // 4 + 0 = 4 (Queen)
            expect(score).toBe(4);
        });
    });

    // Modulo tests with different ranks
    describe('modulo operations with different ranks', () => {
        it('should handle pairs of same rank', () => {
            // Number cards
            expect(sumScore(0, 0)).toBe(1);         // Ace + 0 = 1
            expect(sumScore(1, 0)).toBe(2);         // 1 + 1 = 2
            expect(sumScore(0, 8)).toBe(9);         // 0 + 9 = 9
            expect(sumScore(9, 8)).toBe(8);         // 9 + 9 = 18 % 10 = 8

            // Face cards
            expect(sumScore(0, 9)).toBe(0);         // 0 + 0 = 0 (10)
            expect(sumScore(0, 12)).toBe(0);        // 0 + 0 = 0 (King)
        });

        it('should handle combinations causing modulo', () => {
            expect(sumScore(8, 7)).toBe(6);         // 8 + 8 = 16 % 10 = 6
            expect(sumScore(7, 8)).toBe(6);         // 7 + 9 = 16 % 10 = 6
            expect(sumScore(9, 6)).toBe(6);         // 9 + 7 = 16 % 10 = 6
            expect(sumScore(5, 8)).toBe(4);         // 5 + 9 = 14 % 10 = 4
        });
    });
});

describe('calculateTotalScore', () => {
    // Single card tests
    describe('single card scenarios', () => {
        it('should handle single number cards correctly', () => {
            expect(calculateTotalScore([0])).toBe(1);  // Ace = 1
            expect(calculateTotalScore([4])).toBe(5);  // 5
            expect(calculateTotalScore([8])).toBe(9);  // 9
        });

        it('should handle single face cards correctly', () => {
            expect(calculateTotalScore([9])).toBe(0);   // 10 = 0
            expect(calculateTotalScore([10])).toBe(0);  // Jack = 0
            expect(calculateTotalScore([11])).toBe(0);  // Queen = 0
            expect(calculateTotalScore([12])).toBe(0);  // King = 0
        });
    });

    // Two card combinations
    describe('two card combinations', () => {
        it('should calculate correct total for single digit sum', () => {
            expect(calculateTotalScore([0, 1])).toBe(3);   // 1 + 2 = 3
            expect(calculateTotalScore([3, 4])).toBe(9);   // 4 + 5 = 9
            expect(calculateTotalScore([0, 0])).toBe(2);   // 1 + 1 = 2
        });

        it('should handle combinations with face cards', () => {
            expect(calculateTotalScore([4, 9])).toBe(5);   // 5 + 0 = 5
            expect(calculateTotalScore([9, 4])).toBe(5);   // 0 + 5 = 5
            expect(calculateTotalScore([9, 10])).toBe(0);  // 0 + 0 = 0
        });

        it('should calculate correct total when sum exceeds 10', () => {
            expect(calculateTotalScore([7, 6])).toBe(5);   // 8 + 7 = 15 % 10 = 5
            expect(calculateTotalScore([8, 8])).toBe(8);   // 9 + 9 = 18 % 10 = 8
        });
    });

    // Three or more card combinations
    describe('multiple card combinations', () => {
        it('should handle three card combinations correctly', () => {
            expect(calculateTotalScore([0, 1, 2])).toBe(6);  // 1 + 2 + 3 = 6
            expect(calculateTotalScore([8, 8, 8])).toBe(7);  // 9 + 9 + 9 = 27 % 10 = 7
        });

        it('should handle combinations with face cards', () => {
            expect(calculateTotalScore([9, 10, 11, 12])).toBe(0);  // 0 + 0 + 0 + 0 = 0
            expect(calculateTotalScore([4, 10, 2])).toBe(8);  // 5 + 0 + 3 = 8
        });

        it('should handle large combinations correctly', () => {
            const manyCards = Array(10).fill(1);  // Ten 2's
            expect(calculateTotalScore(manyCards)).toBe(0); // 10 * 2 = 20 % 10 = 0

            const mixedCards = [0, 9, 2, 10, 4];
            expect(calculateTotalScore(mixedCards)).toBe(9); // 1 + 0 + 3 + 0 + 5 = 9
        });
    });

    // Error cases
    describe('error handling', () => {
        it('should throw error for empty array', () => {
            expect(() => calculateTotalScore([])).toThrow('Cards array cannot be empty');
        });

        it('should throw error for null/undefined array', () => {
            expect(() => calculateTotalScore(null as any)).toThrow('Cards array cannot be empty');
            expect(() => calculateTotalScore(undefined as any)).toThrow('Cards array cannot be empty');
        });

        it('should throw error for invalid card values', () => {
            expect(() => calculateTotalScore([-1])).toThrow('Card values must be between 0 and 12');
            expect(() => calculateTotalScore([13])).toThrow('Card values must be between 0 and 12');
            expect(() => calculateTotalScore([1, -1, 2])).toThrow('Card values must be between 0 and 12');
            expect(() => calculateTotalScore([1, 15, 2])).toThrow('Card values must be between 0 and 12');
        });
    });

    // Boundary tests
    describe('boundary conditions', () => {
        it('should handle minimum valid card values', () => {
            expect(calculateTotalScore([0])).toBe(1);  // Minimum card value
            expect(calculateTotalScore([0, 0])).toBe(2);  // Two minimum values
        });

        it('should handle maximum valid card values', () => {
            expect(calculateTotalScore([12])).toBe(0);  // Maximum card value
            expect(calculateTotalScore([12, 12])).toBe(0);  // Two maximum values
        });

        it('should handle mixed boundary values', () => {
            expect(calculateTotalScore([0, 12])).toBe(1);  // Min + Max = 1 + 0 = 1
            expect(calculateTotalScore([12, 0, 12])).toBe(1);  // Max + Min + Max = 0 + 1 + 0 = 1
        });
    });
});
