import * as gc from "@sg/sg-game-client";
import React from "react";
import { setting } from "./game-settings";
import { getGameSetting } from "../../../_shared/app-settings";
import styles from "../../../../src/lobby/lobby.module.scss";
import Image from "next/image";

const gameId = setting.id;
const gameSetting = getGameSetting(gameId);
const gameName = gc.Translator.t(`${gameSetting.gameName}.game_name`);

interface HeaderProps {
    arrowProps?: {
        className?: string;
        onClick?: (e: React.MouseEvent) => void;
    };
}

const Header: React.FC<HeaderProps> = ({ arrowProps }) => {
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
                    src="/static/images/game-icons/sedie.png"
                    alt="Sedie Game Icon"
                    width={32}
                    height={32}
                    className={styles["game-icon"]}
                    priority
                />
                <div>{gameName}</div>
            </div>
            <div className={styles["text-center"]}>Odd/Even</div>
            <div className={styles["text-center"]}>Red/White</div>
        </div>
    );
};

export default Header;
