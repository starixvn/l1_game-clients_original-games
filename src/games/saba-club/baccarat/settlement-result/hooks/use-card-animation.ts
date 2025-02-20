import { useMemo } from 'react';
import type { Result } from "../../baccarat";
import { ANIMATION_CLASSES, CARD_DISPLAY } from '../constants';
import Styles from "../animations/baccarat-animations.module.scss";

interface UseCardAnimationProps {
    result: Result;
    isAnimationResult: boolean;
}

interface UseCardAnimationReturn {
    animationClasses: string;
}

export const useCardAnimation = ({ result, isAnimationResult }: UseCardAnimationProps): UseCardAnimationReturn => {
    const animationClasses = useMemo(() => {
        const resultCount = CARD_DISPLAY.BASE_CARD_COUNT +
            (!!result.player.card3 ? 1 : 0) +
            (!!result.banker.card3 ? 1 : 0);

        const suffix = !result.player.card3 && !!result.banker.card3
            ? CARD_DISPLAY.BANKER_SUFFIX
            : '';

        const classCardCount = `card-${resultCount}${suffix}`;

        return `${Styles[ANIMATION_CLASSES.OPEN_CARDS]} ${Styles[classCardCount]} ${isAnimationResult ? Styles[ANIMATION_CLASSES.HAS_ANIMATION] : ''
            }`;
    }, [result, isAnimationResult]);

    return { animationClasses };
}; 