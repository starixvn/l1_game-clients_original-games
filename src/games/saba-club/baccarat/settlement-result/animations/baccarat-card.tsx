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
    animationDelay
}) => {
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        if (isShowResult) {
            setShouldAnimate(true);
            // Add delay before flipping
            const flipTimer = setTimeout(() => {
                setIsFlipped(true);
            }, animationDelay * 1000 + 500); // Add 500ms after deal animation
            return () => clearTimeout(flipTimer);
        } else {
            setShouldAnimate(false);
            setIsFlipped(false);
        }
    }, [isShowResult, animationDelay]);

    const animationStyles: AnimationStyles = {
        '--animation-duration': `${animationDuration}s`,
        '--animation-delay': `${animationDelay}s`
    };

    return (
        <div
            className={`${Styles.card} ${shouldAnimate ? Styles['has-animation'] : ''} ${Styles[`card${card.order}`]} ${className || ''}`}
            style={animationStyles}
        >
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