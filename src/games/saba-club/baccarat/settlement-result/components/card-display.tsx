import React, { memo } from 'react';
import type { Result } from "../../baccarat";
import { PlayerBankerResultComponent } from "../animations/player-banker-result";
import { useCardAnimation } from '../hooks/use-card-animation';

interface CardDisplayProps {
    result: Result;
    isAnimationResult: boolean;
    isShowResult: boolean;
    texts: {
        player: string;
        banker: string;
    };
}

export const CardDisplay: React.FC<CardDisplayProps> = memo(({
    result,
    isAnimationResult,
    isShowResult,
    texts,
}) => {
    const { animationClasses } = useCardAnimation({ result, isAnimationResult });

    return (
        <div className={animationClasses}>
            <PlayerBankerResultComponent
                playResultAnimation={true}
                result={result}
                texts={texts}
                isShowResult={isShowResult}
            />
        </div>
    );
});

CardDisplay.displayName = 'CardDisplay'; 