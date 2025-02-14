import * as gc from "@sg/sg-game-client";
import React from "react";
import Image from "next/image";
import styles from "../../../../lobby/lobby.module.scss";
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
            <Image
                src="/static/images/lobby/arrow.png"
                alt="Arrow Icon"
                width={24}
                height={24}
                {...arrowProps}
                priority
            />
            <span className={styles.divider} />
            <Image
                src={`/static/images/game-icons/game-icon-${gameId}.png`}
                alt="Game Icon"
                width={32}
                height={32}
                className={styles["game-icon"]}
                priority
            />
            <div>{gameName}</div>
        </div>
    );
};

export default GameTitle; 