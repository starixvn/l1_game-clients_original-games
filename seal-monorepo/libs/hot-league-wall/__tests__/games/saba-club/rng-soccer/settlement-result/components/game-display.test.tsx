import React from 'react';
import { render, screen } from '@testing-library/react';
import { GameDisplay } from '../../../../../../src/games/saba-club/rng-soccer/settlement-result/components/game-display';
import { SCORE_MAP } from '../../../../../../src/games/saba-club/rng-soccer/settlement-result/utils/card-score-utils';
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds';
import type { RNGSoccerResult } from '../../../../../../src/games/saba-club/rng-soccer/type';

// Mock the dependencies
jest.mock('libs/hot-league-wall/src/_shared/components/loading', () => ({
    __esModule: true,
    default: () => <div data-testid="loading">Loading...</div>
}));

jest.mock('../../../../../../src/_shared/components/card', () => ({
    __esModule: true,
    default: ({ result }) => <div data-testid="card">{`Card Rank: ${result.rank}`}</div>
}));

jest.mock('../../../../../../src/games/saba-club/rng-soccer/settlement-result/components/team-card', () => ({
    __esModule: true,
    default: ({ name }) => <div data-testid="team-card">{name}</div>
}));

jest.mock('../../../../../../src/games/saba-club/rng-soccer/settlement-result/components/score-display', () => ({
    __esModule: true,
    default: ({ homeScore, awayScore }) => (
        <div data-testid="score-display">
            {homeScore} - {awayScore}
        </div>
    )
}));

// Extended expect for Jest DOM
declare global {
    namespace jest {
        interface Matchers<R> {
            toBeInTheDocument(): R;
        }
    }
}

describe('GameDisplay', () => {
    // Default props for testing
    const defaultProps = {
        teamData: {
            homeTeam: {
                name: 'Home Team',
                logo: 'home-logo.svg',
                color: '#ff0000'
            },
            awayTeam: {
                name: 'Away Team',
                logo: 'away-logo.svg',
                color: '#0000ff'
            }
        },
        roundState: ROUND_STATE.SHOW_RESULT,
        isFinish: true,
        isAnimationResult: false,
        isLoading: false,
        isHideAllCards: false
    };

    // Happy path test
    it('should display correct scores based on card ranks', () => {
        // Arrange
        const result: RNGSoccerResult = {
            home: { rank: 0, suit: 0 }, // Ace (should be 1 point)
            away: { rank: 12, suit: 1 }, // King (should be 13 points)
            homeScore: 0, // These will be overridden by our calculation
            awayScore: 0
        };

        // Act
        render(<GameDisplay {...defaultProps} result={result} />);

        // Assert
        const scoreDisplay = screen.getByTestId('score-display');
        expect(scoreDisplay.textContent).toBe(`${SCORE_MAP[0]} - ${SCORE_MAP[12]}`);
    });

    // Loading state test
    it('should show loading component when isLoading is true', () => {
        // Arrange
        const props = {
            ...defaultProps,
            isLoading: true
        };

        // Act
        render(<GameDisplay {...props} />);

        // Assert
        expect(screen.getByTestId('loading')).toBeTruthy();
    });

    // Test for missing result data
    it('should display 0 scores when result is undefined', () => {
        // Arrange
        const props = {
            ...defaultProps,
            result: undefined
        };

        // Act
        render(<GameDisplay {...props} />);

        // Assert
        const scoreDisplay = screen.getByTestId('score-display');
        expect(scoreDisplay.textContent).toBe('0 - 0');
    });

    // Edge case test for partial result data
    it('should handle partial result data correctly', () => {
        // Arrange
        const result: Partial<RNGSoccerResult> = {
            home: { rank: 5, suit: 0 }, // 6 points
            // away is intentionally omitted to test handling of missing data
            homeScore: 0,
            awayScore: 0
        };

        // Act
        render(<GameDisplay {...defaultProps} result={result as RNGSoccerResult} />);

        // Assert
        const scoreDisplay = screen.getByTestId('score-display');
        expect(scoreDisplay.textContent).toBe(`${SCORE_MAP[5]} - 0`);
    });
}); 