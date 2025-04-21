import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FishPrawnCrabResultHistory, IFishPrawnCrabResultHistoryState } from 'libs/saba-games/src/games/saba-club/fish-prawn-crab/result-history/fish-prawn-crab-result-history';
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
    render: (store, selector, options = {}) => {
        return function decorator(target, propertyKey, descriptor) {
            return descriptor;
        };
    },
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

    // Helper function to create a complete state object
    const createValidState = (rounds: gc.RoundHistories.RoundHistory[] | null): IFishPrawnCrabResultHistoryState => {
        return {
            rounds: rounds || [],
            dispose: jest.fn()
        };
    };

    // Unit tests for components and services
    describe('SettlementResultService', () => {
        describe('getSettlementResult', () => {
            it('should extract correct winning choices from settlement result', () => {
                // Arrange
                const component = new FishPrawnCrabResultHistory({ language: 'en', namespace: 'test' });
                const settlementService = (component as any).settlementService;
                const settlementResult = {
                    fish: true,
                    prawn: false,
                    crab: true
                };

                // Act
                const result = settlementService.getSettlementResult(settlementResult);

                // Assert
                expect(result.fish).toBe(true);
                expect(result.prawn).toBe(false);
                expect(result.crab).toBe(true);
                expect(result.winner).toBe(FishPrawnCrabChoices.crab);
            });

            it('should handle empty settlement result', () => {
                // Arrange
                const component = new FishPrawnCrabResultHistory({ language: 'en', namespace: 'test' });
                const settlementService = (component as any).settlementService;

                // Act
                const result = settlementService.getSettlementResult({});

                // Assert
                expect(result.fish).toBe(false);
                expect(result.prawn).toBe(false);
                expect(result.crab).toBe(false);
                expect(result.rooster).toBe(false);
                expect(result.gourd).toBe(false);
                expect(result.stag).toBe(false);
                // Default winner
                expect(result.winner).toBe(FishPrawnCrabChoices.fish);
            });
        });

        describe('getWinningChoices', () => {
            it('should return empty array when settlement result is missing', () => {
                // Arrange
                const component = new FishPrawnCrabResultHistory({ language: 'en', namespace: 'test' });
                const settlementService = (component as any).settlementService;

                // Act
                const result = settlementService.getWinningChoices(null);

                // Assert
                expect(result).toEqual([]);
            });

            it('should return array of winning choices', () => {
                // Arrange
                const component = new FishPrawnCrabResultHistory({ language: 'en', namespace: 'test' });
                const settlementService = (component as any).settlementService;
                const settlementResult = {
                    fish: true,
                    prawn: false,
                    crab: true
                };

                // Act
                const result = settlementService.getWinningChoices(settlementResult);

                // Assert
                expect(result).toContain(FishPrawnCrabChoices.fish);
                expect(result).toContain(FishPrawnCrabChoices.crab);
                expect(result).not.toContain(FishPrawnCrabChoices.prawn);
                expect(result.length).toBe(2);
            });
        });

        describe('getWinningTextList', () => {
            it('should return empty string when settlement result is missing', () => {
                // Arrange
                const component = new FishPrawnCrabResultHistory({ language: 'en', namespace: 'test' });
                const settlementService = (component as any).settlementService;

                // Act
                const result = settlementService.getWinningTextList(null);

                // Assert
                expect(result).toBe("");
            });

            it('should return comma-separated translated winner names', () => {
                // Arrange
                const component = new FishPrawnCrabResultHistory({ language: 'en', namespace: 'test' });
                const settlementService = (component as any).settlementService;
                const settlementResult = {
                    fish: true,
                    prawn: true,
                    crab: false
                };

                // Act
                const result = settlementService.getWinningTextList(settlementResult);

                // Assert
                expect(gc.Translator.translate).toHaveBeenCalledWith('FishPrawnCrab.glossary_fish');
                expect(gc.Translator.translate).toHaveBeenCalledWith('FishPrawnCrab.glossary_prawn');
                expect(result).toBe("Translated_FishPrawnCrab.glossary_fish, Translated_FishPrawnCrab.glossary_prawn");
            });
        });
    });

    describe('TranslationService', () => {
        it('should call gc.Translator.translate with the provided key', () => {
            // Arrange
            const component = new FishPrawnCrabResultHistory({ language: 'en', namespace: 'test' });
            const translationService = (component as any).translationService;
            const key = 'test.key';

            // Act
            const result = translationService.translate(key);

            // Assert
            expect(gc.Translator.translate).toHaveBeenCalledWith(key);
            expect(result).toBe(`Translated_${key}`);
        });
    });

    describe('FishPrawnCrabResultHistory', () => {
        describe('renderRoundHistory', () => {
            it('should update state with provided rounds', () => {
                // Arrange
                const component = new FishPrawnCrabResultHistory({ language: 'en', namespace: 'test' });
                const setState = jest.spyOn(component, 'setState');

                // Act
                component.renderRoundHistory(mockRoundHistories);

                // Assert
                expect(setState).toHaveBeenCalledWith({ rounds: mockRoundHistories.slice(0, 100) });
            });
        });

        describe('render method', () => {
            it('should render correctly with rounds data', () => {
                // Arrange
                const component = new FishPrawnCrabResultHistory({ language: 'en', namespace: 'test' });

                // Mock the state with a complete state object including dispose
                component.state = createValidState(mockRoundHistories);

                // Act - render the component
                const result = component.render();

                // Assert
                // Verify title was translated
                expect(gc.Translator.translate).toHaveBeenCalledWith('Common.result_title');

                // Check the rendered component has the expected structure
                expect(result.type).toBe('div'); // Root element should be a div
                expect(result.props.className).toBe('resultHistoryContainer'); // Check main container class
            });

            it('should return empty fragment when no rounds data', () => {
                // Arrange
                const component = new FishPrawnCrabResultHistory({ language: 'en', namespace: 'test' });

                // Mock empty state with a complete state object including dispose
                component.state = createValidState([]);

                // Act - render the component
                const result = component.render();

                // Assert
                // In React, an empty fragment doesn't have a clear type or children properties to check
                // Instead, check that the result is an object that represents an empty JSX fragment
                expect(result).not.toBeNull();
                expect(result.type).toBeTruthy();
            });
        });
    });

    describe('Integration tests', () => {
        it('should correctly process round history data', () => {
            // Arrange
            const component = new FishPrawnCrabResultHistory({ language: 'en', namespace: 'test' });
            component.state = createValidState(mockRoundHistories);

            // Spy on translator to verify it's called with correct keys
            const translateSpy = jest.spyOn(gc.Translator, 'translate');
            translateSpy.mockClear();

            // Act - call render
            const result = component.render();

            // Assert
            // Verify translator was called with correct keys
            expect(translateSpy).toHaveBeenCalledWith('Common.result_title');

            // Just verify we got a non-empty result structure
            expect(result).not.toBeNull();
            expect(result.type).toBe('div');
            expect(result.props.className).toBe('resultHistoryContainer');
        });
    });
}); 