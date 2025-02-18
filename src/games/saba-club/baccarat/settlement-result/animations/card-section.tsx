import React from "react";
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
    return (
        <div className={Styles.cardSection} style={{ height: "100%" }}>
            <div className={`${Styles.label} ${type === "player" ? Styles["label-player"] : Styles["label-banker"]}`}>{label}</div>
            <div className={`${Styles.cardContainer} ${Styles[type]} ${!playResultAnimation ? Styles["move-up-no-animation"] : ""}`}>
                {(type === "player" ? [...cards].reverse() : cards).map((card, index) => (
                    <BaccaratCard
                        key={card.order}
                        card={card}
                        className={index === 0 && type === "player" && cards.length === 3 ? Styles.rotateLeft : index === 2 && type === "banker" ? Styles.rotateRight : ""}
                        isShowResult={isShowResult}
                    />
                ))}
                <div className={Styles.scoreOverlay}>
                    {isShowResult && (
                        <ScoreDisplay
                            label={label}
                            score={score}
                            cardsCount={cards.length}
                            type={type}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}; 