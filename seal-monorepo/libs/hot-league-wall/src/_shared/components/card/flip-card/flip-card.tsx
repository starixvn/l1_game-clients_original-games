import React, { useEffect, useState } from "react";

import Card from "..";
import CardBack from "../card-back";
import { CardResult } from "../type";
import Styles from "./flip-card.module.scss";

interface FlipCardProps {
    card: CardResult;
    isShowResult: boolean;
    playResultAnimation?: boolean;
    onAnimationComplete?: () => void;
}

export const FlipCard: React.FC<FlipCardProps> = ({ card, isShowResult, playResultAnimation, onAnimationComplete }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [flipAnimationClass, setFlipAnimationClass] = useState('');

    useEffect(() => {
        if (isFlipped && playResultAnimation) {
            setFlipAnimationClass(Styles['flip']);
        } else if (isFlipped) {
            setFlipAnimationClass(`${Styles['flip']} ${Styles['no-animation']}`);
        } else {
            setFlipAnimationClass('');
        }
    }, [isFlipped, playResultAnimation]);

    useEffect(() => {
        if (isShowResult) {
            setIsFlipped(true);
        } else {
            setIsFlipped(false);
        }
    }, [isShowResult, card]);

    const handleAnimationEnd = () => {
        if (onAnimationComplete && isFlipped) {
            onAnimationComplete();
        }
    };

    return (
        <div
            className={`${Styles.card} ${flipAnimationClass}`}
            onAnimationEnd={handleAnimationEnd}
        >
            <div className={Styles['rotate-card']}>
                <div className={Styles.cardFace}>
                    <div className={Styles['card-back']}>
                        <CardBack />
                    </div>
                    <div className={Styles['card-front']}>
                        <Card result={card} customClassName={'card-baccarat'} />
                    </div>
                </div>
            </div>
        </div>
    );
};
