import * as gc from "@sg/sg-game-client";
import React from "react";
import Image from "next/image";
import styles from "../../../lobby/lobby.module.scss";
import { getGameSetting } from "../../app-settings";

export interface GameHeaderProps {
    gameId: number;
    arrowProps?: {
        className?: string;
        onClick?: (e: React.MouseEvent) => void;
    };
    centerTexts?: string[];
}

export abstract class GameHeader extends React.Component<GameHeaderProps> {
    render() {
        const { arrowProps, centerTexts = [], gameId } = this.props;
        const gameSetting = getGameSetting(gameId);
        const gameName = gc.Translator.t(`${gameSetting?.gameName}.game_name`);

        return (
            <div className={styles["game-title"]}>
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
                {centerTexts.map((text, index) => (
                    <div key={index} className={styles["game-title-text-center"]}>
                        {text}
                    </div>
                ))}
            </div>
        );
    }
}

export default GameHeader; 