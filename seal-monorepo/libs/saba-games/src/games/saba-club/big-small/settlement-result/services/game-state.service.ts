import * as gc from "@sg/sg-game-client";
import { BigSmallResult } from "../../type"

export interface GameState {
    result?: BigSmallResult;
    roundState: string;
    isAnimationResult: boolean;
}

class GameStateService {
    public handleRoundState(roundState: string): void {
        if (!roundState) {
            throw new Error('Round state cannot be empty');
        }
    }

    public handleSettlement(currentFinish: gc.GameServiceMessage.Finish): BigSmallResult | undefined {
        if (!currentFinish?.result) {
            return undefined;
        }
        return currentFinish.result as BigSmallResult;
    }

    public handleGameHistory(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory): BigSmallResult | undefined {
        if (!firstJoinGameHistory?.roundHistory?.result) {
            return undefined;
        }
        return firstJoinGameHistory.roundHistory.result as BigSmallResult;
    }

    public validateResult(result: BigSmallResult): boolean {
        return !!(
            result?.dice1 &&
            result?.dice2 &&
            result?.dice3
        );
    }
}

export const gameStateService = new GameStateService(); 