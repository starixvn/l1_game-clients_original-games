import * as gc from "@sg/sg-game-client";
import React from "react";
import { getGameSetting } from "../../_shared/app-settings";
import styles from "../../../src/lobby/lobby.module.scss";
import { settingsBigSmall } from "./game-settings";

const gameId = settingsBigSmall.id;
const gameSetting = getGameSetting(gameId);
const gameName = gc.Translator.t(`${gameSetting.gameName}.game_name`);

const Header = () => {
    return (
        <div className={styles["game-title"]}>
            <div>{gameName}</div>
            <div className={styles["text-center"]}>Big/Small</div>
            <div className={styles["text-center"]}>Odd/Even</div>
        </div>
    );
};

export default Header;