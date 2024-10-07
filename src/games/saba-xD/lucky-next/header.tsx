import * as gc from "@sg/sg-game-client";
import React from "react";
import { getGameSetting } from "../../../_shared/app-settings";
import styles from "../../../../src/lobby/lobby.module.scss";
import { setting } from "./game-settings";

const gameId = setting.id;
const gameSetting = getGameSetting(gameId);
const gameName = gc.Translator.t(`${gameSetting.gameName}.game_name`);

const Header = () => {
    return (
        <div className={`${styles["game-title"]} ${styles["lucky-next-header"]}`}>
            <div>{gameName}</div>
            <div className={styles["text-center"]}>Next O/U</div>
            <div className={styles["text-center"]}>Next O/E</div>
        </div>
    );
};

export default Header;