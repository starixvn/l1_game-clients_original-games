import { choiceToSymbol, MAX_DISPLAYED_ROUNDS } from '../../../../../src/games/saba-club/fish-prawn-crab/constants/fish-prawn-crab-constants';
import { FishPrawnCrabChoices } from '../../../../../src/games/saba-club/fish-prawn-crab/type';
import { FishPrawnCrabSymbol } from '../../../../../src/_shared/components/fish-prawn-crab-dice';

describe('Fish Prawn Crab Constants', () => {
    // Test the choiceToSymbol mapping
    describe('choiceToSymbol', () => {
        it('should correctly map each FishPrawnCrabChoice to the corresponding symbol', () => {
            // Arrange & Act & Assert
            expect(choiceToSymbol[FishPrawnCrabChoices.fish]).toBe(FishPrawnCrabSymbol.FISH);
            expect(choiceToSymbol[FishPrawnCrabChoices.prawn]).toBe(FishPrawnCrabSymbol.PRAWN);
            expect(choiceToSymbol[FishPrawnCrabChoices.crab]).toBe(FishPrawnCrabSymbol.CRAB);
            expect(choiceToSymbol[FishPrawnCrabChoices.rooster]).toBe(FishPrawnCrabSymbol.ROOSTER);
            expect(choiceToSymbol[FishPrawnCrabChoices.gourd]).toBe(FishPrawnCrabSymbol.GOURD);
            expect(choiceToSymbol[FishPrawnCrabChoices.stag]).toBe(FishPrawnCrabSymbol.STAG);
        });

        it('should have a mapping for all FishPrawnCrabChoices values', () => {
            // Arrange
            const allChoices = Object.values(FishPrawnCrabChoices);

            // Act
            const mappedChoices = Object.keys(choiceToSymbol) as FishPrawnCrabChoices[];

            // Assert
            // Check that all choices have a mapping
            expect(mappedChoices.length).toBe(allChoices.length);
            allChoices.forEach(choice => {
                expect(choiceToSymbol[choice]).toBeDefined();
            });
        });
    });

    // Test MAX_DISPLAYED_ROUNDS
    describe('MAX_DISPLAYED_ROUNDS', () => {
        it('should be set to 3', () => {
            // Arrange & Act & Assert
            expect(MAX_DISPLAYED_ROUNDS).toBe(3);
        });
    });
}); 