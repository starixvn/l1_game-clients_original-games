import * as GameLogic from '../../../../src/games/game-base/game-logic/index';
import { GameSettlementHandler } from '../../../../src/games/game-base/game-logic/game-settlement-handler';
import { RoundHandler } from '../../../../src/games/game-base/game-logic/round-handler';

describe('Game Logic exports', () => {
    test('should export GameSettlementHandler', () => {
        expect(GameLogic.GameSettlementHandler).toBeDefined();
        expect(GameLogic.GameSettlementHandler).toBe(GameSettlementHandler);
    });

    test('should export RoundHandler', () => {
        expect(GameLogic.RoundHandler).toBeDefined();
        expect(GameLogic.RoundHandler).toBe(RoundHandler);
    });
}); 