import * as gc from "@sg/sg-game-client";
import { IGameBaseState } from "../../../_shared/components/game-base";

export interface IBaccaratResult {
    playerScore: number;
    bankerScore: number;
    playerCards: string[];
    bankerCards: string[];
    winner: "player" | "banker" | "tie";
}

export interface IBaccaratBet {
    type: "player" | "banker" | "tie" | "playerPair" | "bankerPair";
    amount: number;
}

export interface IBaccaratState extends IGameBaseState {
    currentBets: IBaccaratBet[];
    lastResult?: IBaccaratResult;
    roundHistory: IBaccaratResult[];
    totalWin: number;
    isRoundOpen: boolean;
    timeRemaining: number;
}

export interface IBaccaratProps {
    namespace: string;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
} 