// Mock the dependencies first before any imports
jest.mock('@sg/sg-observer', () => ({
    handle: () => jest.fn(),
    render: () => jest.fn(),
}));

jest.mock('@sg/sg-game-client', () => ({
    // Mock the gc.Rounds namespace
    Rounds: {
        RoundTimeStore: {},
        RoundStore: {}
    }
}));

jest.mock('@sg/sg-game-client/dist/game/rounds', () => ({}));
jest.mock('@sg/sg-game-client/dist/game/rounds/round-time-store', () => ({
    ROUND_STATE: {
        START_GAME_LOOP: 'START_GAME_LOOP',
        STARTING_ROUND: 'STARTING_ROUND',
        PLACING_BET: 'PLACING_BET',
        LOCKING_BET: 'LOCKING_BET',
        WAITING: 'WAITING',
        SHOW_ANIMATION_RESULT: 'SHOW_ANIMATION_RESULT',
        SHOW_RESULT: 'SHOW_RESULT',
        CHANGE_REMAINING_TIME: 'CHANGE_REMAINING_TIME',
        STOP_GAME_LOOP: 'STOP_GAME_LOOP',
        NONE: 'NONE',
    },
}));

// Now import after all mocks are defined
import { RoundHandler } from '../../../../src/games/game-base/game-logic/round-handler';
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds/round-time-store';
import { IGameBaseState } from '../../../../src/games/game-base/interfaces';

describe('RoundHandler', () => {
    let roundHandler: RoundHandler<IGameBaseState>;
    let mockSetState: jest.Mock;
    let mockResetBettingPanel: jest.Mock;
    let mockProcessAuthorizationIfRoundMatches: jest.Mock;
    let initialState: Partial<IGameBaseState>;

    beforeEach(() => {
        mockSetState = jest.fn();
        mockResetBettingPanel = jest.fn();
        mockProcessAuthorizationIfRoundMatches = jest.fn();
        roundHandler = new RoundHandler<IGameBaseState>();

        // Reset mocks between tests
        jest.clearAllMocks();

        initialState = {
            isShowNextRoundMessage: true,
            roundState: ROUND_STATE.NONE,
            roundId: 0
        };
    });

    describe('renderCountDownTimerState', () => {
        test('should set isShowNextRoundMessage to false when roundState is PLACING_BET', () => {
            // Arrange
            const roundState = ROUND_STATE.PLACING_BET;

            // Act
            roundHandler.renderCountDownTimerState(
                roundState,
                initialState as IGameBaseState,
                mockSetState,
                mockResetBettingPanel
            );

            // Assert
            expect(mockSetState).toHaveBeenCalledWith({ isShowNextRoundMessage: false });
            expect(mockSetState).toHaveBeenCalledWith({ roundState });
        });

        test('should call resetBettingPanel when roundState is LOCKING_BET', () => {
            // Arrange
            const roundState = ROUND_STATE.LOCKING_BET;

            // Act
            roundHandler.renderCountDownTimerState(
                roundState,
                initialState as IGameBaseState,
                mockSetState,
                mockResetBettingPanel
            );

            // Assert
            expect(mockResetBettingPanel).toHaveBeenCalled();
            expect(mockSetState).toHaveBeenCalledWith({ roundState });
        });

        test('should call resetBettingPanel when roundState is SHOW_RESULT', () => {
            // Arrange
            const roundState = ROUND_STATE.SHOW_RESULT;

            // Act
            roundHandler.renderCountDownTimerState(
                roundState,
                initialState as IGameBaseState,
                mockSetState,
                mockResetBettingPanel
            );

            // Assert
            expect(mockResetBettingPanel).toHaveBeenCalled();
            expect(mockSetState).toHaveBeenCalledWith({ roundState });
        });

        test('should update roundState for any other state value', () => {
            // Arrange
            const roundState = ROUND_STATE.NONE;

            // Act
            roundHandler.renderCountDownTimerState(
                roundState,
                initialState as IGameBaseState,
                mockSetState,
                mockResetBettingPanel
            );

            // Assert
            expect(mockResetBettingPanel).not.toHaveBeenCalled();
            expect(mockSetState).toHaveBeenCalledWith({ roundState });
        });
    });

    describe('handleRoundIdChange', () => {
        test('should update roundId and call processAuthorizationIfRoundMatches', () => {
            // Arrange
            const roundId = 123;

            // Act
            roundHandler.handleRoundIdChange(
                roundId,
                mockSetState,
                mockProcessAuthorizationIfRoundMatches
            );

            // Assert
            expect(mockSetState).toHaveBeenCalledWith({ roundId });
            expect(mockProcessAuthorizationIfRoundMatches).toHaveBeenCalledWith(roundId);
        });
    });

    describe('handleBetOption', () => {
        test('should reset betting panel and show next round message temporarily', () => {
            // Arrange
            jest.useFakeTimers();

            // Act
            roundHandler.handleBetOption(mockSetState, mockResetBettingPanel);

            // Assert
            expect(mockResetBettingPanel).toHaveBeenCalled();
            expect(mockSetState).toHaveBeenCalledWith({ isShowNextRoundMessage: true });

            // Should set isShowNextRoundMessage to false after timeout
            jest.advanceTimersByTime(3000);
            expect(mockSetState).toHaveBeenCalledWith({ isShowNextRoundMessage: false });

            jest.useRealTimers();
        });

        test('should set timeout when calling handleBetOption', () => {
            // Arrange
            jest.useFakeTimers();
            const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

            // Act
            roundHandler.handleBetOption(mockSetState, mockResetBettingPanel);

            // Assert
            expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
            expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 3000);

            jest.useRealTimers();
            setTimeoutSpy.mockRestore();
        });
    });
}); 