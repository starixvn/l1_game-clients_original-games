import React, { memo } from 'react';
import type { Result } from "../../baccarat";
import { useCardAnimation } from '../hooks/use-card-animation';
import PlayerBankerResultComponent from './player-banker-result';

interface CardDisplayProps {
    result: Result;
    isAnimationResult: boolean;
    isShowResult: boolean;
    language: string;
}

export const CardDisplay: React.FC<CardDisplayProps> = memo(({
    result,
    isAnimationResult,
    isShowResult,
    language,
}) => {
    const { animationClasses } = useCardAnimation({ result, isAnimationResult });

    return (
        <div className={animationClasses}>
            <PlayerBankerResultComponent
                playResultAnimation={true}
                result={result}
                isShowResult={isShowResult}
                language={language}
            />
        </div>
    );
});

CardDisplay.displayName = 'CardDisplay'; 