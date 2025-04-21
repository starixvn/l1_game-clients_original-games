import React from 'react';
import { render } from '@testing-library/react';
import EmptyDiceRow from '../../../../../src/games/saba-club/fish-prawn-crab/round-history/empty-dice-row';
import { Size } from '../../../../../src/_shared/constants';
import FishPrawnCrabDice, { FishPrawnCrabSymbol } from '../../../../../src/_shared/components/fish-prawn-crab-dice';

// Mock the FishPrawnCrabDice component
jest.mock('../../../../../src/_shared/components/fish-prawn-crab-dice', () => {
    return {
        __esModule: true,
        default: jest.fn(props => <div data-testid={props['data-testid'] || 'mock-dice'} />),
        FishPrawnCrabSymbol: {
            EMPTY: 'empty'
        }
    };
});

describe('EmptyDiceRow', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Happy path test
    it('should render with default props (3 empty dice with medium size)', () => {
        // Arrange & Act
        const { getAllByTestId } = render(<EmptyDiceRow />);

        // Assert
        expect(getAllByTestId(/^empty-dice-/).length).toBe(3);
        expect(FishPrawnCrabDice).toHaveBeenCalledTimes(3);
        expect(FishPrawnCrabDice).toHaveBeenCalledWith(
            expect.objectContaining({
                symbol: FishPrawnCrabSymbol.EMPTY,
                size: Size.medium
            }),
            expect.anything()
        );
    });

    // Test with custom count (boundary condition)
    it('should render the specified number of dice', () => {
        // Arrange & Act
        const { getAllByTestId } = render(<EmptyDiceRow count={5} />);

        // Assert
        expect(getAllByTestId(/^empty-dice-/).length).toBe(5);
        expect(FishPrawnCrabDice).toHaveBeenCalledTimes(5);
    });

    // Test with 0 count (edge case)
    it('should render no dice when count is 0', () => {
        // Arrange & Act
        const { queryByTestId } = render(<EmptyDiceRow count={0} />);

        // Assert
        expect(queryByTestId(/^empty-dice-/)).toBeNull();
        expect(FishPrawnCrabDice).not.toHaveBeenCalled();
    });

    // Test with custom size prop
    it('should render dice with the specified size', () => {
        // Arrange & Act
        render(<EmptyDiceRow size={Size.small} />);

        // Assert
        expect(FishPrawnCrabDice).toHaveBeenCalledWith(
            expect.objectContaining({
                size: Size.small
            }),
            expect.anything()
        );
    });

    // Test with both custom props
    it('should render with both custom count and size', () => {
        // Arrange & Act
        const { getAllByTestId } = render(<EmptyDiceRow count={2} size={Size.large} />);

        // Assert
        expect(getAllByTestId(/^empty-dice-/).length).toBe(2);
        expect(FishPrawnCrabDice).toHaveBeenCalledTimes(2);
        expect(FishPrawnCrabDice).toHaveBeenCalledWith(
            expect.objectContaining({
                size: Size.large
            }),
            expect.anything()
        );
    });

    // Test for unique test IDs (important for React arrays)
    it('should render each dice with a unique test ID', () => {
        // Arrange & Act
        const { getAllByTestId } = render(<EmptyDiceRow count={3} />);

        // Assert
        const testIds = getAllByTestId(/^empty-dice-/).map(elem => elem.getAttribute('data-testid'));

        // All test IDs should be unique
        expect(new Set(testIds).size).toBe(testIds.length);

        // Test IDs should follow the expected pattern
        testIds.forEach((id, index) => {
            expect(id).toBe(`empty-dice-${index}`);
        });
    });
}); 