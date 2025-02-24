import React, { useState, useEffect, useCallback } from "react";
import { CardOrder } from "../../baccarat"
import Styles from "./baccarat-animations.module.scss";
import { BaccaratCard } from "./baccarat-card";
import { ScoreDisplay } from "./score-display";
import { CardOrderWithTiming } from "../../baccarat-helper";
import { sumScore } from "./score-utils";

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
    const [visibleScores, setVisibleScores] = useState<{ [key: number]: boolean }>({});

    // Reset states when show result changes
    useEffect(() => {
        if (!isShowResult) {
            setVisibleScores({});
        }
    }, [isShowResult]);

    const handleCardFlip = useCallback((card: CardOrder, accumulatedScore: number) => {
        // Add delay to match card flip animation completion
        setTimeout(() => {
            setVisibleScores(prev => ({
                ...prev,
                [card.order]: true
            }));
            console.log(`${type} card ${card.order} opened: ${card.value.card + 1}, accumulated score: ${accumulatedScore}, time: ${new Date()}`);
        }, 600); // Match the animation duration from BaccaratCard
    }, [type]);

    // Get the appropriate score display class based on card order
    const getScoreDisplayClass = (cardOrder: number) => {
        const baseClass = Styles.scoreWrapper;
        const visibleClass = visibleScores[cardOrder] ? Styles.visible : '';
        return `${baseClass} ${visibleClass}`;
    };

    return (
        <div className={Styles.cardSection} style={{ height: "100%" }}>
            <div className={`${Styles.label} ${type === "player" ? Styles["label-player"] : Styles["label-banker"]}`}>{label}</div>
            <div className={`${Styles.cardContainer} ${Styles[type]} ${!playResultAnimation ? Styles["move-up-no-animation"] : ""}`}>
                {(type === "player" ? [...cards].reverse() : cards).map((card, index) => (
                    <BaccaratCard
                        key={card.order}
                        card={card}
                        isShowResult={isShowResult}
                        animationDuration={0.6}
                        animationDelay={card.animationDelay / 1000}
                        onCardFlip={handleCardFlip}
                    />
                ))}
                <div className={Styles.scoreOverlay}>
                    {isShowResult && cards.map((card, index) => (
                        <div key={card.order}>
                            <ScoreDisplay
                                label={label}
                                score={card.accumulatedScore}
                                cardsCount={index + 1}
                                type={type}
                                visible={visibleScores[card.order]}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}; 