import React from "react";
import styles from "../../../../lobby/lobby.module.scss";

export interface GameHeaderCenterTextsProps {
    texts: string[];
}

export const GameHeaderCenterTexts: React.FC<GameHeaderCenterTextsProps> = ({ texts = [] }) => {
    return (
        <>
            {texts.map((text, index) => (
                <div key={index} className={styles["game-title-text-center"]}>
                    {text}
                </div>
            ))}
        </>
    );
};

export default GameHeaderCenterTexts; 