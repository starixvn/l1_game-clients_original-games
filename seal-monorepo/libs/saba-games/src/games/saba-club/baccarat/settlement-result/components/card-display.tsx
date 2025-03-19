import React, { memo } from "react";

import PlayerBankerResultComponent from "./player-banker-result";

import type { Result } from '../../baccarat';
interface CardDisplayProps {
    result: Result;
    isAnimationResult: boolean;
    isShowResult: boolean;
    language: string;
    isFinishShowResult: boolean;
}

export const CardDisplay: React.FC<CardDisplayProps> = memo(({ result, isAnimationResult, isShowResult, language, isFinishShowResult }) => {
    return (
        <PlayerBankerResultComponent
            playResultAnimation={isAnimationResult}
            result={result}
            isShowResult={isShowResult}
            language={language}
            isFinishShowResult={isFinishShowResult}
        />
    );
});

CardDisplay.displayName = 'CardDisplay';
