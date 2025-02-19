import React, { useEffect, useState } from "react";
import Card from "../../../../../_shared/components/card";
import { CardOrder } from "../../baccarat";
import Styles from "./baccarat-card.module.scss";
import CardBack from "../../../../../_shared/components/card/card-back";

interface BaccaratCardProps {
    card: CardOrder;
    className?: string;
    isShowResult: boolean;
    animationDuration: number;
    animationDelay: number;
    onCardFlip?: (card: CardOrder, accumulatedScore: number) => void;
}

interface AnimationStyles extends React.CSSProperties {
    '--animation-duration': string;
    '--animation-delay': string;
}

export const BaccaratCard: React.FC<BaccaratCardProps> = ({
    card,
    className,
    isShowResult,
    animationDuration,
    animationDelay,
    onCardFlip
}) => {
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        if (isShowResult) {
            const flipTimer = setTimeout(() => {
                setIsFlipped(true);
                if (onCardFlip) {
                    console.log(`Card flipped: ${card.value.card + 1}, accumulated score: ${card.accumulatedScore}`);
                    onCardFlip(card, card.accumulatedScore);
                }
            }, animationDelay * 1000);
            return () => clearTimeout(flipTimer);
        } else {
            setIsFlipped(false);
        }
    }, [isShowResult, animationDelay, card, onCardFlip]);

    return (
        <div className={`${Styles.card} ${Styles[`card${card.order}`]} ${className || ''}`}>
            <div className={`${Styles["rotate-card"]} ${isFlipped ? Styles['flip'] : ''}`}>
                <div className={Styles.cardFace}>
                    <div className={Styles["card-back"]}>
                        <CardBack />
                    </div>
                    <div className={Styles["card-front"]}>
                        <Card result={card.value} customClassName={"card-baccarat"} />
                    </div>
                </div>
            </div>
        </div>
    );
}; 