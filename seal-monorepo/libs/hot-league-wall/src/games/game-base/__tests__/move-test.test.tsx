import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import from the new location
import {
    GameBase,
    GatewayGameBase,
    GameUIRenderer,
    GameSettlementHandler,
    RoundHandler
} from '..';

// Import types from the new location
import type { GameBaseProps } from '../type';
import { IGatewayGameBaseState } from '../interfaces/gateway-types';

// This is a simple test component that verifies we can use the imported components
const TestComponent: React.FC = () => {
    return (
        <div>
            <h1>Game Base Move Test</h1>
            <p>This test verifies that all imports from the new game-base location are working.</p>
        </div>
    );
};

// Simple verification test
test('should successfully import all components', () => {
    // This test just verifies the imports work
    expect(GameBase).toBeDefined();
    expect(GatewayGameBase).toBeDefined();
    expect(GameUIRenderer).toBeDefined();
    expect(GameSettlementHandler).toBeDefined();
    expect(RoundHandler).toBeDefined();
});

export default TestComponent; 