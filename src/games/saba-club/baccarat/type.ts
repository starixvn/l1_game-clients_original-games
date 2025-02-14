import * as gc from "@sg/sg-game-client";

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

export interface IBaccaratState extends gc.GameServiceMessage.IGameState {
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