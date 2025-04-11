import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameContainer from '../index';

// Mock SCSS module
jest.mock('./game-container.module.scss', () => ({
    'game-container': 'mock-game-container',
}));

describe('GameContainer Component', () => {
    it('should render children inside the container', () => {
        render(
            <GameContainer>
                <div>Test Child</div>
            </GameContainer>
        );

        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('should apply the correct class name from styles', () => {
        const { container } = render(
            <GameContainer>
                <span>Content</span>
            </GameContainer>
        );

        expect(container.firstChild).toHaveClass('mock-game-container');
    });
});
