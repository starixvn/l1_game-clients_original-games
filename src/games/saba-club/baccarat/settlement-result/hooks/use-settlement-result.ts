import { useState, useEffect } from 'react';
import * as gc from "@sg/sg-game-client";
import { RoundHistoryStore } from "@sg/sg-game-client/dist/game/round-histories";
import { RoundTimeStore } from "@sg/sg-game-client/dist/game/rounds";
import { SettlementStore } from "@sg/sg-game-client/dist/game/settlements";
import type { Result } from "../../baccarat";
import { observer } from '@sg/sg-observer';

export interface UseSettlementResultReturn {
    result: Result | undefined;
    roundState: string;
    isAnimationResult: boolean;
    isResultVisible: boolean;
    toggleResultVisibility: () => void;
}

export const useSettlementResult = observer(() => {
    const [result, setResult] = useState<Result>();
    const [roundState, setRoundState] = useState("");
    const [isAnimationResult, setIsAnimationResult] = useState(false);
    const [isResultVisible, setIsResultVisible] = useState(false);

    // Subscribe to round state changes
    RoundTimeStore.observe((store) => store.roundState, (newRoundState) => {
        setRoundState(newRoundState);
    });

    // Subscribe to settlement changes
    SettlementStore.observe((store) => store.currentFinish, (currentFinish) => {
        if (!currentFinish?.result) return;
        setResult(currentFinish.result as Result);
        setIsAnimationResult(true);
    });

    // Subscribe to game history
    RoundHistoryStore.observe((store) => store.firstJoinGameHistory, (firstJoinGameHistory) => {
        if (!firstJoinGameHistory?.roundHistory?.result) return;
        setResult(firstJoinGameHistory.roundHistory.result as Result);
    });

    const toggleResultVisibility = () => {
        setIsResultVisible((prev) => !prev);
    };

    return {
        result,
        roundState,
        isAnimationResult,
        isResultVisible,
        toggleResultVisibility,
    };
}); 