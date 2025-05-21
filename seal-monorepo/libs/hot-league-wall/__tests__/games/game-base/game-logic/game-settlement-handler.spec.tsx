// Mock dependencies first before any imports
jest.mock('@sg/sg-observer', () => ({
    handle: () => jest.fn(),
    render: () => jest.fn(),
}));

jest.mock('@sg/sg-game-client', () => ({
    Bet: {
        BetStore: jest.fn(),
        IValidBet: jest.fn(),
    },
    Settlements: {
        SettlementStatusStore: jest.fn(),
        SettlementStore: jest.fn(),
        SettlementUIHandlers: {
            FinishedShowResult: 'FINISHED_SHOW_RESULT',
        },
    },
    GameServiceMessage: {
        Status: jest.fn(),
        Finish: jest.fn(),
        TResult: jest.fn(),
        TSettlementResult: jest.fn(),
    },
}));

// Create a mockExecuteSyncBalance function that can be spied on
const mockExecuteSyncBalance = jest.fn();

// Mock SyncMemberSiteBalance utility with a proper mock implementation
jest.mock('../../../../src/_shared/utils/sync-member-site-balance', () => {
    return {
        SyncMemberSiteBalance: {
            getInstance: jest.fn(() => ({
                executeSyncBalance: mockExecuteSyncBalance
            }))
        }
    };
});

// Import dependencies after mocks
import { GameSettlementHandler } from '../../../../src/games/game-base/game-logic/game-settlement-handler';
import * as gc from '@sg/sg-game-client';
import { IGameBaseState } from '../../../../src/games/game-base/interfaces';
// Import SyncMemberSiteBalance after the mock is set up
import { SyncMemberSiteBalance } from '../../../../src/_shared/utils/sync-member-site-balance';

describe('GameSettlementHandler', () => {
    let gameSettlementHandler: GameSettlementHandler<IGameBaseState>;
    let mockSetState: jest.Mock;
    let mockShowResult: jest.Mock;
    let mockFinishShowResult: jest.Mock;
    let initialState: Partial<IGameBaseState>;

    beforeEach(() => {
        mockSetState = jest.fn();
        mockShowResult = jest.fn().mockResolvedValue(undefined);
        mockFinishShowResult = jest.fn();
        gameSettlementHandler = new GameSettlementHandler<IGameBaseState>();

        // Reset mocks between tests
        jest.clearAllMocks();
        mockExecuteSyncBalance.mockClear();

        initialState = {
            statusSettlement: undefined,
            isFinishShowResult: false,
        };
    });

    describe('setIsValidBet', () => {
        test('should not execute sync balance when validBet.value is falsy', () => {
            // Arrange
            const validBet = { value: false };

            // Act
            gameSettlementHandler.setIsValidBet(validBet as any, mockSetState);

            // Assert
            expect(mockExecuteSyncBalance).not.toHaveBeenCalled();
        });

        test('should execute sync balance when validBet.value is truthy', () => {
            // Arrange
            const validBet = { value: true };

            // Act
            gameSettlementHandler.setIsValidBet(validBet as any, mockSetState);

            // Assert
            expect(mockExecuteSyncBalance).toHaveBeenCalled();
        });


        test('should not execute sync balance when validBet is null', () => {
            // Arrange
            const validBet = null;

            // Act
            gameSettlementHandler.setIsValidBet(validBet as any, mockSetState);

            // Assert
            expect(mockExecuteSyncBalance).not.toHaveBeenCalled();
        });
    });

    describe('assignStatus', () => {
        test('should update statusSettlement in state', () => {
            // Arrange
            const settlementStatus = { status: 'SOME_STATUS' };

            // Act
            gameSettlementHandler.assignStatus(settlementStatus, mockSetState);

            // Assert
            expect(mockSetState).toHaveBeenCalledWith({ statusSettlement: settlementStatus });
        });
    });

    describe('renderCurrentFinish', () => {
        test('should set isFinishShowResult to false and call showResult when result and settlementResult are valid', async () => {
            // Arrange
            const currentFinish = {
                result: { some: 'result' },
                settlementResult: { some: 'settlementResult' }
            };

            // Act
            gameSettlementHandler.renderCurrentFinish(
                currentFinish as any,
                initialState as IGameBaseState,
                mockSetState,
                mockShowResult,
                mockFinishShowResult
            );

            // Assert
            expect(mockSetState).toHaveBeenCalledWith({ isFinishShowResult: false });
            expect(mockShowResult).toHaveBeenCalledWith(
                true,
                currentFinish.result,
                currentFinish.settlementResult
            );

            // Wait for the promise to resolve
            await new Promise(process.nextTick);

            // Check if finishShowResult was called after promise resolution
            expect(mockFinishShowResult).toHaveBeenCalled();
        });

        test('should not do anything when currentFinish is null', () => {
            // Arrange
            const currentFinish = null;

            // Act
            gameSettlementHandler.renderCurrentFinish(
                currentFinish as any,
                initialState as IGameBaseState,
                mockSetState,
                mockShowResult,
                mockFinishShowResult
            );

            // Assert
            expect(mockSetState).not.toHaveBeenCalled();
            expect(mockShowResult).not.toHaveBeenCalled();
        });

        test('should not do anything when result is missing', () => {
            // Arrange
            const currentFinish = {
                result: null,
                settlementResult: { some: 'settlementResult' }
            };

            // Act
            gameSettlementHandler.renderCurrentFinish(
                currentFinish as any,
                initialState as IGameBaseState,
                mockSetState,
                mockShowResult,
                mockFinishShowResult
            );

            // Assert
            expect(mockSetState).not.toHaveBeenCalled();
            expect(mockShowResult).not.toHaveBeenCalled();
        });

        test('should not do anything when settlementResult is missing', () => {
            // Arrange
            const currentFinish = {
                result: { some: 'result' },
                settlementResult: null
            };

            // Act
            gameSettlementHandler.renderCurrentFinish(
                currentFinish as any,
                initialState as IGameBaseState,
                mockSetState,
                mockShowResult,
                mockFinishShowResult
            );

            // Assert
            expect(mockSetState).not.toHaveBeenCalled();
            expect(mockShowResult).not.toHaveBeenCalled();
        });
    });

    describe('finishShowResult', () => {
        test('should set isFinishShowResult to true', () => {
            // Act
            gameSettlementHandler.finishShowResult(mockSetState);

            // Assert
            expect(mockSetState).toHaveBeenCalledWith({ isFinishShowResult: true });
        });
    });

    describe('isValidResult', () => {
        test('should return true when both result and settlementResult are truthy', () => {
            // Arrange
            const result = { some: 'result' };
            const settlementResult = { some: 'settlementResult' };

            // Act
            const isValid = gameSettlementHandler.isValidResult(result as any, settlementResult as any);

            // Assert
            expect(isValid).toBe(true);
        });

        test('should return false when result is falsy', () => {
            // Arrange
            const result = null;
            const settlementResult = { some: 'settlementResult' };

            // Act
            const isValid = gameSettlementHandler.isValidResult(result as any, settlementResult as any);

            // Assert
            expect(isValid).toBe(false);
        });

        test('should return false when settlementResult is falsy', () => {
            // Arrange
            const result = { some: 'result' };
            const settlementResult = null;

            // Act
            const isValid = gameSettlementHandler.isValidResult(result as any, settlementResult as any);

            // Assert
            expect(isValid).toBe(false);
        });

        test('should return false when both result and settlementResult are falsy', () => {
            // Arrange
            const result = null;
            const settlementResult = null;

            // Act
            const isValid = gameSettlementHandler.isValidResult(result as any, settlementResult as any);

            // Assert
            expect(isValid).toBe(false);
        });
    });
}); 