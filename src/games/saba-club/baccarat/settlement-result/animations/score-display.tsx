import React from "react";
import Styles from "./score-display.module.scss";

interface ScoreDisplayProps {
    label: string;
    score: number;
    cardsCount: number;
    type: 'player' | 'banker';
    visible: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ label, score, cardsCount, type, visible }) => {
    const classGroupCards = `group-${cardsCount}-cards`;

    if (!visible) return null;

    return (
        <div className={`${Styles[classGroupCards]} ${Styles.score} ${Styles[`${type}-score`]}`}>
            {/* {label} */}
            <span className={Styles["score-number"]}>{score}</span>
        </div>
    );
}; 