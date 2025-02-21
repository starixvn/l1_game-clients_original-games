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

// Define fixed timings for card pairs
const FIRST_PAIR_TIME = 0;    // Immediate for cards 1 and 3
const SECOND_PAIR_TIME = 300; // For cards 2 and 4
const THIRD_CARD_TIME = 1400;
const FOURTH_CARD_TIME = 2100;

export const BaccaratCard: React.FC<BaccaratCardProps> = ({
    card,
    className,
    isShowResult,
    animationDuration,
    animationDelay,
    onCardFlip
}) => {
    const [isFlipped, setIsFlipped] = useState(false);

    // Add rotation class based on card order
    const getRotationClass = (order: number) => {
        if (order === 5) return Styles['rotate-right']; // Player's third card
        if (order === 6) return Styles['rotate-left']; // Banker's third card
        return '';
    };

    // Add banker third card class when it's the third card and player has only 2 cards
    const getBankerThirdCardClass = (order: number) => {
        if (order === 5 && !card.playerHasThirdCard) {
            return Styles['banker-third-card'];
        }
        return '';
    };

    useEffect(() => {
        if (isShowResult) {
            // Group cards for simultaneous opening
            let delay;
            if (card.order === 1 || card.order === 3) { // First and third cards together
                delay = FIRST_PAIR_TIME;
            } else if (card.order === 2 || card.order === 4) { // Second and fourth cards together
                delay = SECOND_PAIR_TIME;
            } else if (card.order === 5) {
                delay = THIRD_CARD_TIME;
            } else {
                delay = FOURTH_CARD_TIME;
            }

            const flipTimer = setTimeout(() => {
                setIsFlipped(true);
                if (onCardFlip) {
                    const cardType = card.order <= 2 ? 'player' : 'banker';
                    const cardNumber = card.order <= 2 ? card.order : card.order - 2;
                    onCardFlip(card, card.accumulatedScore);
                }
            }, delay);

            return () => clearTimeout(flipTimer);
        } else {
            setIsFlipped(false);
        }
    }, [isShowResult, card, onCardFlip]);

    return (
        <div className={`${Styles.card} ${Styles[`card${card.order}`]} ${isFlipped ? Styles['flip'] : ''} ${getRotationClass(card.order)} ${getBankerThirdCardClass(card.order)} ${className || ''}`}>
            <div className={Styles["rotate-card"]}>
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