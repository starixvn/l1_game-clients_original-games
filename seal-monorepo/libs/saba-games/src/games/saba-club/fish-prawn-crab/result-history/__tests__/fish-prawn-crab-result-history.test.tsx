import React from 'react';
import { render, screen } from '@testing-library/react';
import * as gc from '@sg/sg-game-client';
import { FishPrawnCrabResultHistory, IFishPrawnCrabResultHistoryProps, IFishPrawnCrabResultHistoryState } from '../fish-prawn-crab-result-history';
import { ISettlementResultService } from '../../services/settlement-result-service';
import { ITranslationService } from '../../services/translation-service';

// Mock dependencies
jest.mock('@sg/sg-observer', () => ({
    render: jest.fn((store, selector) => (target: any, name: string) => {
        target[name] = jest.fn();
        return target[name];
    })
}));

// Mock gc.RoundHistories
jest.mock('@sg/sg-game-client', () => {
    return {
        Translator: {
            translate: jest.fn((key) => `translated_${key}`)
        },
        RoundHistories: {
            RoundHistoryStore: {}
        }
    };
});

describe('FishPrawnCrabResultHistory', () => {
    // Mock services
    const mockTranslationService: ITranslationService = {
        translate: jest.fn((key) => `translated_${key}`)
    };

    const mockSettlementService: ISettlementResultService = {
        getSettlementResult: jest.fn(),
        getWinningChoices: jest.fn(),
        getWinningTextList: jest.fn((result) => 'Winning Symbols Text')
    };

    // Mock round history store with correct types
    const mockRoundHistories = [
        {
            roundId: 1,
            result: {
                dice1: 'fish',
                dice2: 'crab',
                dice3: 'prawn'
            },
            settlementResult: { fish: true }
        },
        {
            roundId: 2,
            result: {
                dice1: 'stag',
                dice2: 'gourd',
                dice3: 'crab'
            },
            settlementResult: { stag: true, crab: true }
        }
    ] as unknown as gc.RoundHistories.RoundHistory[];

    // Set up props that match the interface
    const testProps: IFishPrawnCrabResultHistoryProps = {
        language: 'en',
        namespace: 'test-namespace',
        settlementService: mockSettlementService,
        translationService: mockTranslationService
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should render empty state when no rounds exist', () => {
        // Arrange
        const component = new FishPrawnCrabResultHistory(testProps);

        // Mock state with proper dispose method
        const mockState: IFishPrawnCrabResultHistoryState = {
            rounds: [],
            dispose: jest.fn()
        };
        component.state = mockState;

        // Act
        const { container } = render(component.render());

        // Assert
        expect(container.firstChild).toBeNull();
    });

    test('should render round history table when rounds exist', () => {
        // Arrange
        const component = new FishPrawnCrabResultHistory(testProps);

        // Set state with mock rounds and proper dispose method
        const mockState: IFishPrawnCrabResultHistoryState = {
            rounds: mockRoundHistories,
            dispose: jest.fn()
        };
        component.state = mockState;

        // Act - call renderRoundHistory to update state
        component.renderRoundHistory(mockRoundHistories);

        // Render with populated state
        const { container } = render(component.render());

        // Assert
        expect(mockTranslationService.translate).toHaveBeenCalledWith('Common.result_title');
        expect(mockSettlementService.getWinningTextList).toHaveBeenCalled();
        expect(container.querySelector('.resultHistoryContainer')).not.toBeNull();
        expect(container.querySelector('.result-table')).not.toBeNull();
    });

    test('should inject default services if not provided', () => {
        // Arrange & Act
        const basicProps: IFishPrawnCrabResultHistoryProps = {
            language: 'en',
            namespace: 'test-namespace'
        };
        const component = new FishPrawnCrabResultHistory(basicProps);

        // Assert - checking that component initialized with default services
        expect(component['settlementService']).not.toBeNull();
        expect(component['translationService']).not.toBeNull();
    });
}); 