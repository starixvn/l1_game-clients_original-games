import * as gc from "@sg/sg-game-client";
import React from "react";
import { setting } from "./game-settings";
import { getGameSetting } from "../../../_shared/app-settings";
import styles from "../../../../src/lobby/lobby.module.scss";

const gameId = setting.id;
const gameSetting = getGameSetting(gameId);
const gameName = gc.Translator.t(`${gameSetting.gameName}.game_name`);

const Header = () => {
    return (
        <div className={styles["game-title"]}>
            <div>{gameName}</div>
            <div className={styles["text-center"]}>VIP Odd/Even</div>
            <div className={styles["text-center"]}>Red/White</div>
        </div>
    );
};

export default Header; 