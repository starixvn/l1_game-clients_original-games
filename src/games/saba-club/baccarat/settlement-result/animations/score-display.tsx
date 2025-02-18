import React from "react";
import Styles from "./baccarat-animations.module.scss";

interface ScoreDisplayProps {
    label: string;
    score: number;
    cardsCount: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ label, score, cardsCount }) => {
    const classGroupCards = `group-${cardsCount}-cards`;

    return (
        <div className={`${Styles[classGroupCards]} ${Styles["score"]}`}>
            {label}
            <span className={Styles["score-number"]}>{score}</span>
        </div>
    );
}; 