import * as gc from "@sg/sg-game-client";
import React from "react";
import styles from "./game-header.module.scss";
import { getGameSetting } from "../../../app-settings";

export interface GameTitleProps {
    gameId: number;
    arrowProps?: {
        className?: string;
        onClick?: (e: React.MouseEvent) => void;
    };
}

export const GameTitle: React.FC<GameTitleProps> = ({ gameId, arrowProps }) => {
    const gameSetting = getGameSetting(gameId);
    const gameName = gc.Translator.t(`${gameSetting?.gameName}.game_name`);

    return (
        <div className={styles["title-with-icon"]}>
            <img
                src="/static/images/lobby/arrow.png"
                alt="Arrow Icon"
                width={24}
                height={24}
                className={styles["arrow-icon"]}
                {...arrowProps}
            />
            <span className={styles.divider} />
            <img
                src={`/static/images/game-icons/game-icon-${gameId}.png`}
                alt="Game Icon"
                width={32}
                height={32}
                className={styles["game-icon"]}
            />
            <div>{gameName}</div>
        </div>
    );
};

export default GameTitle; 