import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FishPrawnCrabBetPercentages } from 'libs/saba-games/src/games/saba-club/fish-prawn-crab/bet-percentages';
import * as gc from '@sg/sg-game-client';
import { FishPrawnCrabChoices } from 'libs/saba-games/src/games/saba-club/fish-prawn-crab/type';
import * as fishPrawnCrabUtils from 'libs/saba-games/src/games/saba-club/fish-prawn-crab/fish-prawn-crab-utils';
import { FishPrawnCrabSymbol } from 'libs/saba-games/src/_shared/components/fish-prawn-crab-dice';

// We don't need to mock bet-bercentage-item as we want to test the real component
// in integration with FishPrawnCrabBetPercentages

// Mock essential dependencies but not the actual component under test
jest.mock('@sg/sg-game-client', () => ({
    ...jest.requireActual('@sg/sg-game-client'),
    Translator: {
        t: jest.fn((key) => `translated_${key}`)
    },
    RoundHistories: {}
}));

// Mock FishPrawnCrabDice to avoid actual image rendering
jest.mock('libs/saba-games/src/_shared/components/fish-prawn-crab-dice', () => {
    const originalModule = jest.requireActual('libs/saba-games/src/_shared/components/fish-prawn-crab-dice');
    return {
        __esModule: true,
        ...originalModule,
        default: jest.fn(({ symbol, size }) => (
            <img
                data-testid="fpc-dice"
                data-symbol={symbol}
                data-size={size}
                alt={`fish-prawn-crab-${symbol?.toLowerCase()}`}
                src={`${symbol?.toLowerCase()}.png`}
            />
        ))
    };
});

// Mock fish-prawn-crab-utils to provide deterministic conversion results
jest.mock('libs/saba-games/src/games/saba-club/fish-prawn-crab/fish-prawn-crab-utils', () => ({
    ...jest.requireActual('libs/saba-games/src/games/saba-club/fish-prawn-crab/fish-prawn-crab-utils'),
    convertValueToSymbol: jest.fn((value) => {
        const symbolMap = {
            0: 'STAG',
            1: 'GOURD',
            2: 'ROOSTER',
            3: 'FISH',
            4: 'CRAB',
            5: 'PRAWN'
        };
        return symbolMap[value] || 'EMPTY';
    }),
    resultMapper: {
        fish: 3,
        prawn: 5,
        crab: 4,
        rooster: 2,
        gourd: 1,
        stag: 0
    }
}));

// Mock the CSS modules
jest.mock('libs/saba-games/src/games/saba-club/fish-prawn-crab/bet-percentages/fish-prawn-crab-bet-percentages.module.scss', () => ({
    'fpc-percentages': 'mocked-fpc-percentages',
    'percentage-item': 'mocked-percentage-item',
    count: 'mocked-count'
}));

describe('FishPrawnCrabBetPercentages Integration', () => {
    // Define round history type
    interface MockRoundHistory {
        roundId: string;
        result: any;
        settlementResult?: any;
    }

    // Test data
    const mockRounds: MockRoundHistory[] = [
        {
            roundId: '1',
            result: {},
            settlementResult: {
                fish: true,
                prawn: false,
                crab: false,
                rooster: false,
                gourd: false,
                stag: false
            }
        },
        {
            roundId: '2',
            result: {},
            settlementResult: {
                fish: false,
                prawn: true,
                crab: false,
                rooster: false,
                gourd: false,
                stag: false
            }
        }
    ];

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render the entire component hierarchy correctly', () => {
        // Arrange
        const props = {
            gameName: 'fish-prawn-crab',
            rounds: mockRounds as unknown as gc.RoundHistories.RoundHistory[],
        };

        // Act
        const { container } = render(<FishPrawnCrabBetPercentages {...props} />);

        // Assert
        // 1. Check that the main container exists with the correct class
        const mainContainer = container.firstChild;
        expect(mainContainer).toHaveClass('mocked-fpc-percentages');

        // 2. Check that we have the correct number of percentage items
        const percentageItems = container.querySelectorAll('.mocked-percentage-item');
        expect(percentageItems.length).toBe(Object.values(FishPrawnCrabChoices).length);

        // 3. Check that all count elements are rendered
        const countElements = container.querySelectorAll('.mocked-count');
        expect(countElements.length).toBe(Object.values(FishPrawnCrabChoices).length);

        // 4. Map the actual text content to an array
        const countTexts = Array.from(countElements).map(el => el.textContent);

        // 5. Count how many of each number appears
        const counts = countTexts.reduce((acc, curr) => {
            acc[curr as string] = (acc[curr as string] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // 6. Based on our mock data, fish and prawn should be 1, rest should be 0
        expect(counts['1']).toBe(2);
        expect(counts['0']).toBe(4);
    });

    test('should handle undefined settlementResult correctly', () => {
        // Arrange
        const roundsWithUndefined: MockRoundHistory[] = [
            {
                roundId: '1',
                result: {},
                // missing settlementResult
            }
        ];

        const props = {
            gameName: 'fish-prawn-crab',
            rounds: roundsWithUndefined as unknown as gc.RoundHistories.RoundHistory[],
        };

        // Act
        const { container } = render(<FishPrawnCrabBetPercentages {...props} />);

        // Assert
        // All counts should be 0
        const countElements = container.querySelectorAll('.mocked-count');

        // Check all values are 0
        const allZeros = Array.from(countElements).every(el => el.textContent === '0');
        expect(allZeros).toBe(true);
        expect(countElements.length).toBe(6); // One for each choice
    });

    test('should integrate with custom translator', () => {
        // Arrange
        const customTranslator = jest.fn((key) => `custom_${key}`);
        const props = {
            gameName: 'fish-prawn-crab',
            rounds: mockRounds as unknown as gc.RoundHistories.RoundHistory[],
            translator: customTranslator
        };

        // Act
        const { container } = render(<FishPrawnCrabBetPercentages {...props} />);

        // Assert
        // Verify the component rendered properly with all percentage items
        const percentageItems = container.querySelectorAll('.mocked-percentage-item');
        expect(percentageItems.length).toBe(Object.values(FishPrawnCrabChoices).length);

        // The translator would be used by BetPercentageItem, but we're not displaying
        // the translated text in the current implementation (it's commented out)
    });
}); 