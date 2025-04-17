import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FishPrawnCrabResultHistory } from 'libs/saba-games/src/games/saba-club/fish-prawn-crab/result-history/fish-prawn-crab-result-history';
import * as gc from '@sg/sg-game-client';
import { FishPrawnCrabChoices } from 'libs/saba-games/src/games/saba-club/fish-prawn-crab/type';

// Mock dependencies
jest.mock('@sg/sg-game-client', () => ({
    RoundHistories: {
        RoundHistoryStore: {
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
        },
        RoundHistory: jest.fn(),
    },
    Translator: {
        translate: jest.fn((key) => `Translated_${key}`),
        getCurrentLanguageId: jest.fn(() => 'en'),
    },
    GameServiceMessage: {
        TSettlementResult: {}
    }
}));

jest.mock('@sg/sg-observer', () => ({
    render: jest.fn(),
    useObserver: jest.fn(),
}));

jest.mock('libs/saba-games/src/games/saba-club/fish-prawn-crab/dot/fish-prawn-crab-dot', () =>
    function MockFishPrawnCrabDot(props) {
        return <div data-testid={`dot-${props.choice}`}>{props.choice}</div>;
    }
);

jest.mock('libs/saba-games/src/_shared/components/fish-prawn-crab-dice', () =>
    function MockFishPrawnCrabDice(props) {
        return <div data-testid={`dice-${props.symbol}`}>{props.symbol}</div>;
    }
);

describe('FishPrawnCrabResultHistory', () => {
    // Sample round history data for testing
    const mockRoundHistories = [
        {
            roundId: 1001,
            settlementResult: {
                fish: true,
                prawn: false,
                crab: false,
                rooster: false,
                gourd: false,
                stag: false
            },
            result: {
                dice1: 1,
                dice2: 1,
                dice3: 3
            }
        },
        {
            roundId: 1002,
            settlementResult: {
                fish: false,
                prawn: true,
                crab: false,
                rooster: true,
                gourd: false,
                stag: false
            },
            result: {
                dice1: 2,
                dice2: 2,
                dice3: 4
            }
        }
    ] as gc.RoundHistories.RoundHistory[];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Happy Path Tests
    it('should render the result history with correct rows and dice', () => {
        // Arrange
        const component = new FishPrawnCrabResultHistory({ language: 'en', namespace: 'test' });

        // Act
        // Manually call the decorated method to simulate store update
        component.renderRoundHistory(mockRoundHistories);
        const { container } = render(component.render());

        // Assert
        expect(screen.getByText('Translated_Common.result_title')).toBeInTheDocument();
        expect(screen.getByText('Round 1001')).toBeInTheDocument();
        expect(screen.getByText('Round 1002')).toBeInTheDocument();

        // Check for rows
        expect(container.querySelectorAll('tr').length).toBe(2);
        expect(container.querySelectorAll('td').length).toBe(6);

        // Check for dice
        expect(screen.getAllByTestId('dice-1').length).toBe(2);
        expect(screen.getAllByTestId('dice-2').length).toBe(2);
        expect(screen.getByTestId('dice-3')).toBeInTheDocument();
        expect(screen.getByTestId('dice-4')).toBeInTheDocument();

        // Check for result text
        expect(screen.getByText('Translated_FishPrawnCrab.fish')).toBeInTheDocument();
        expect(screen.getByText('Translated_FishPrawnCrab.prawn, Translated_FishPrawnCrab.rooster')).toBeInTheDocument();
    });

    // Edge Cases
    it('should handle empty rounds array gracefully', () => {
        // Arrange
        const component = new FishPrawnCrabResultHistory({ language: 'en', namespace: 'test' });

        // Act
        component.renderRoundHistory([]);
        const { container } = render(component.render());

        // Assert
        expect(container.innerHTML).toBe('');
    });

    it('should handle null rounds gracefully', () => {
        // Arrange
        const component = new FishPrawnCrabResultHistory({ language: 'en', namespace: 'test' });

        // Act
        // @ts-ignore - Intentionally testing incorrect type for edge case
        component.setState({ rounds: null });
        const { container } = render(component.render());

        // Assert
        expect(container.innerHTML).toBe('');
    });

    // Testing specific methods
    describe('renderSymbols', () => {
        it('should return null when result is missing', () => {
            // Arrange
            const component = new FishPrawnCrabResultHistory({ language: 'en', namespace: 'test' });
            const roundHistory = {
                roundId: 1003,
                settlementResult: {
                    fish: true
                },
                // result is missing
            } as unknown as gc.RoundHistories.RoundHistory;

            // Act
            const result = component.renderSymbols(roundHistory);

            // Assert
            expect(result).toBeNull();
        });

        it('should render dice for each value', () => {
            // Arrange
            const component = new FishPrawnCrabResultHistory({ language: 'en', namespace: 'test' });
            const roundHistory = {
                roundId: 1004,
                settlementResult: {
                    fish: true
                },
                result: {
                    dice1: 1,
                    dice2: 2,
                    dice3: 3
                }
            } as gc.RoundHistories.RoundHistory;

            // Act
            const result = component.renderSymbols(roundHistory);

            // If result is not null, render it for testing
            if (result) {
                const { container } = render(result);
                // Assert
                expect(container.querySelectorAll('[data-testid^="dice-"]').length).toBe(3);
            } else {
                fail('Result should not be null');
            }
        });
    });

    describe('renderWinningSymbols', () => {
        it('should return null when settlement result is missing', () => {
            // Arrange
            const component = new FishPrawnCrabResultHistory({ language: 'en', namespace: 'test' });
            const roundHistory = {
                roundId: 1005,
                // settlementResult is missing
                result: {}
            } as gc.RoundHistories.RoundHistory;

            // Act
            const result = component.renderWinningSymbols(roundHistory);

            // Assert
            expect(result).toBeNull();
        });

        it('should render dots for each winning choice', () => {
            // Arrange
            const component = new FishPrawnCrabResultHistory({ language: 'en', namespace: 'test' });
            const roundHistory = {
                roundId: 1006,
                settlementResult: {
                    fish: true,
                    prawn: true,
                    crab: false
                },
                result: {}
            } as gc.RoundHistories.RoundHistory;

            // Act
            const result = component.renderWinningSymbols(roundHistory);

            // Assert
            // We know result won't be null because we provided valid settlement data
            expect(result!.length).toBe(2); // Should have 2 winning symbols
        });
    });

    describe('getWinningTextList', () => {
        it('should return empty string when settlement result is missing', () => {
            // Arrange
            const component = new FishPrawnCrabResultHistory({ language: 'en', namespace: 'test' });
            const roundHistory = {
                roundId: 1007,
                // settlementResult is missing
                result: {}
            } as gc.RoundHistories.RoundHistory;

            // Act
            const result = component.getWinningTextList(roundHistory);

            // Assert
            expect(result).toBe("");
        });

        it('should return comma-separated translated winner names', () => {
            // Arrange
            const component = new FishPrawnCrabResultHistory({ language: 'en', namespace: 'test' });
            const roundHistory = {
                roundId: 1008,
                settlementResult: {
                    gourd: true,
                    crab: true,
                    stag: true
                },
                result: {}
            } as gc.RoundHistories.RoundHistory;

            // Act
            const result = component.getWinningTextList(roundHistory);

            // Assert
            expect(result).toBe("Translated_FishPrawnCrab.gourd, Translated_FishPrawnCrab.crab, Translated_FishPrawnCrab.stag");
        });
    });
}); 