import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ResultDisplay } from '../../../../../src/games/saba-club/fish-prawn-crab/settlement-result/result-display';
import { SettlementService } from '../../../../../src/games/saba-club/fish-prawn-crab/services/settlement-service';

// Mock dependencies
jest.mock('@sg/sg-game-client', () => ({
    Translator: {
        t: jest.fn((key) => {
            // Simple mock implementation that returns the key part after glossary_
            const parts = key.split('glossary_');
            return parts.length > 1 ? parts[1].toUpperCase() : key;
        })
    }
}));

jest.mock('../../../../../src/games/saba-club/fish-prawn-crab/services/settlement-service', () => ({
    SettlementService: {
        getSettlementResult: jest.fn(),
        getWinningSymbols: jest.fn()
    }
}));

jest.mock('../../../../../src/games/saba-club/fish-prawn-crab/fish-prawn-crab-utils', () => ({
    convertValueToSymbol: jest.fn((value) => {
        // Mock implementation that maps numeric values to symbol strings
        const valueToSymbol = {
            1: 'fish',
            2: 'prawn',
            3: 'crab',
            4: 'rooster',
            5: 'gourd',
            6: 'stag'
        };
        return valueToSymbol[value] || 'empty';
    })
}));

jest.mock('../../../../../src/_shared/components/winner-display/winner-display', () => ({
    WinnerDisplay: jest.fn(({ resultText, className }) => (
        <div data-testid="winner-display" className={className}>{resultText}</div>
    ))
}));

describe('ResultDisplay', () => {
    // Reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return null when settlementResult is empty', () => {
        // Arrange
        const props = {
            settlementResult: {},
            result: {},
            language: 'en'
        };

        // Act
        const { container } = render(<ResultDisplay {...props} />);

        // Assert
        expect(container.firstChild).toBeNull();
    });

    it('should display winning symbols using SettlementService', () => {
        // Arrange
        const settlementResult = { fish: true, crab: true };
        const mockWinningResult = { fish: 1, crab: 1 };
        const mockWinningSymbols = ['fish', 'crab'];

        (SettlementService.getSettlementResult as jest.Mock).mockReturnValue(mockWinningResult);
        (SettlementService.getWinningSymbols as jest.Mock).mockReturnValue(mockWinningSymbols);

        const props = {
            settlementResult,
            result: {},
            language: 'en'
        };

        // Act
        render(<ResultDisplay {...props} />);

        // Assert
        expect(SettlementService.getSettlementResult).toHaveBeenCalledWith(settlementResult);
        expect(SettlementService.getWinningSymbols).toHaveBeenCalledWith(mockWinningResult);
        expect(screen.getByTestId('winner-display')).toHaveTextContent('FISH - CRAB');
    });

    it('should fall back to result method when SettlementService returns no symbols', () => {
        // Arrange
        const settlementResult = { fish: true }; // Non-empty but will produce no winning symbols
        const result = { dice1: 1, dice2: 3 }; // These correspond to fish and crab values

        // Mock SettlementService to return empty winning symbols
        (SettlementService.getSettlementResult as jest.Mock).mockReturnValue({});
        (SettlementService.getWinningSymbols as jest.Mock).mockReturnValue([]);

        const props = {
            settlementResult,
            result,
            language: 'en'
        };

        // Act
        render(<ResultDisplay {...props} />);

        // Assert
        expect(screen.getByTestId('winner-display')).toHaveTextContent('FISH - CRAB');
    });

    it('should use the provided className', () => {
        // Arrange
        const settlementResult = { fish: true };
        const mockWinningResult = { fish: 1 };
        const mockWinningSymbols = ['fish'];

        (SettlementService.getSettlementResult as jest.Mock).mockReturnValue(mockWinningResult);
        (SettlementService.getWinningSymbols as jest.Mock).mockReturnValue(mockWinningSymbols);

        const props = {
            settlementResult,
            result: {},
            language: 'en',
            className: 'custom-class'
        };

        // Act
        render(<ResultDisplay {...props} />);

        // Assert
        expect(screen.getByTestId('winner-display')).toHaveClass('custom-class');
    });

    it('should use default className when none provided', () => {
        // Arrange
        const settlementResult = { fish: true };
        const mockWinningResult = { fish: 1 };
        const mockWinningSymbols = ['fish'];

        (SettlementService.getSettlementResult as jest.Mock).mockReturnValue(mockWinningResult);
        (SettlementService.getWinningSymbols as jest.Mock).mockReturnValue(mockWinningSymbols);

        const props = {
            settlementResult,
            result: {},
            language: 'en'
        };

        // Act
        render(<ResultDisplay {...props} />);

        // Assert
        expect(screen.getByTestId('winner-display')).toHaveClass('fish-prawn-crab-result');
    });
}); 