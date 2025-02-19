import React, { useState, useEffect } from "react";
import { CardOrder } from "../../baccarat"
import Styles from "./baccarat-animations.module.scss";
import { BaccaratCard } from "./baccarat-card";
import { ScoreDisplay } from "./score-display";

interface CardSectionProps {
    cards: CardOrder[];
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
            }, 300); // Adjust delay as needed
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
                        className={index === 0 && type === "player" && cards.length === 3 ? Styles.rotateLeft : index === 2 && type === "banker" ? Styles.rotateRight : ""}
                        isShowResult={isShowResult}
                        animationDuration={index * 0.5}
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