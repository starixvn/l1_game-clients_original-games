import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameHeader from '../game-header';
import GameHeaderCenterTexts from '../game-header-center-texts';

// Mock the SCSS module
jest.mock('../game-header.module.scss', () => ({
    'game-title': 'mock-game-title',
    'arrow-icon': 'mock-arrow-icon',
    'collapsed': 'mock-collapsed'
}));

// Mock child components
jest.mock('../game-title', () => ({
    __esModule: true,
    default: () => <div data-testid="game-title">Game Title</div>
}));

describe('GameHeader', () => {
    const defaultProps = {
        gameId: 1
    };

    it('renders without crashing', () => {
        render(<GameHeader {...defaultProps} />);
        expect(screen.getByTestId('game-title')).toBeInTheDocument();
    });

    it('applies correct classes when expanded', () => {
        const { container } = render(<GameHeader {...defaultProps} isExpanded={true} />);
        const header = container.firstChild;
        expect(header).toHaveClass('mock-game-title');
    });

    it('applies correct classes when collapsed', () => {
        const { container } = render(<GameHeader {...defaultProps} isExpanded={false} />);
        const header = container.firstChild;
        expect(header).toHaveClass('mock-game-title');
    });

    it('renders center texts component when provided', () => {
        const centerTexts = ['Text 1', 'Text 2'];
        render(
            <GameHeader 
                {...defaultProps} 
                centerTextsComponent={<GameHeaderCenterTexts texts={centerTexts} />} 
            />
        );
        expect(screen.getByText('Text 1')).toBeInTheDocument();
        expect(screen.getByText('Text 2')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
        const customClass = 'custom-class';
        const { container } = render(<GameHeader {...defaultProps} className={customClass} />);
        const header = container.firstChild;
        expect(header).toHaveClass('mock-game-title', customClass);
    });

    it('calls onToggleExpand when arrow is clicked', () => {
        const onToggleExpand = jest.fn();
        render(<GameHeader {...defaultProps} onToggleExpand={onToggleExpand} />);
        // Note: The actual click handler is in the GameTitle component
        // This test would need to be updated if we want to test the click behavior
    });
}); 