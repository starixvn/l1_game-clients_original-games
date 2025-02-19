import React, { useState, useEffect } from "react";
import { CardOrder } from "../../baccarat"
import Styles from "./baccarat-animations.module.scss";
import { BaccaratCard } from "./baccarat-card";
import { ScoreDisplay } from "./score-display";
import { CardOrderWithTiming } from "../../baccarat-helper";

interface CardSectionProps {
    cards: CardOrderWithTiming[];
    label: string;
    score: number;
    type: "player" | "banker";
    playResultAnimation: boolean;
    isShowResult: boolean;
}

export const CardSection: React.FC<CardSectionProps> = ({
    cards,
    label,
    score,
    type,
    playResultAnimation,
    isShowResult,
}) => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [currentScore, setCurrentScore] = useState(0);

    useEffect(() => {
        if (currentCardIndex < cards.length) {
            const timer = setTimeout(() => {
                console.log(`Rendering card at index: ${currentCardIndex}, Card value: ${cards[currentCardIndex].value.card}`);
                setCurrentCardIndex(currentCardIndex + 1);
                // Update score logic here, assuming score is cumulative
                setCurrentScore(prevScore => {
                    const newScore = prevScore + cards[currentCardIndex].value.card;
                    console.log(`Updated score: ${newScore}`);
                    return newScore;
                });
            }, cards[currentCardIndex].animationDelay); // Use the card's animation delay
            return () => clearTimeout(timer);
        }
    }, [currentCardIndex, cards]);

    return (
        <div className={Styles.cardSection} style={{ height: "100%" }}>
            <div className={`${Styles.label} ${type === "player" ? Styles["label-player"] : Styles["label-banker"]}`}>{label}</div>
            <div className={`${Styles.cardContainer} ${Styles[type]} ${!playResultAnimation ? Styles["move-up-no-animation"] : ""}`}>
                {(type === "player" ? [...cards].reverse() : cards).slice(0, currentCardIndex).map((card, index) => (
                    <BaccaratCard
                        key={card.order}
                        card={card}
                        isShowResult={isShowResult}
                        animationDuration={0.8} // Standard animation duration
                        animationDelay={card.animationDelay / 1000} // Convert to seconds
                    // className={index === 0 && type === "player" && cards.length === 3 ? Styles.rotateLeft : index === 2 && type === "banker" ? Styles.rotateRight : ""}
                    />
                ))}
                <div className={Styles.scoreOverlay}>
                    {isShowResult && (
                        <ScoreDisplay
                            label={label}
                            score={currentScore}
                            cardsCount={cards.length}
                            type={type}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}; 