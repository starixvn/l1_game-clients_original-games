import * as gc from "@sg/sg-game-client";
import { settingsBigSmall } from "../games/big-small/game-settings";
import BigSmall from "../games/big-small/page";
import { settingsSeDie } from "../games/sedie/game-settings";
import SeDie from "../games/sedie/page";
import SeDieHeader from "../games/sedie/header";
import BigSmallHeader from "../games/big-small/header";
import { NextRouter } from "next/router";
import { getGameSettingIds, getGameSetting } from "../_shared/app-settings";
import { Tab } from "react-bootstrap";
import styles from "./lobby.module.scss";

const getGameById = (gameId: number, router: NextRouter) => {
    const games: { [x: number]: JSX.Element } = {
        [settingsSeDie.id]: <SeDie router={router} namespace={settingsSeDie.mainObserverNamespace} />,
        [settingsBigSmall.id]: <BigSmall router={router} namespace={settingsBigSmall.mainObserverNamespace} />,
    };
    return games[gameId];
};

const getGameHeaderById = (gameId: number) => {
    const gameHeader = {
        [settingsSeDie.id]: <SeDieHeader />,
        [settingsBigSmall.id]: <BigSmallHeader />,
    };
    return gameHeader[gameId];
};

const getFilteredGames = (
    offerGames: {
        gameId: number;
    }[]
) => {
    const gameSettingIds = getGameSettingIds();

    return gameSettingIds.filter((gameSettingId) => offerGames.find((offerGame) => offerGame.gameId === gameSettingId));
};

const getGameTabById = (gameId: number, router: NextRouter) => {
    const gameSetting = getGameSetting(gameId);

    const gameName = gc.Translator.t(`${gameSetting.gameName}.game_name`);
    const key = gameSetting.mainObserverNamespace;
    return (
        <Tab key={key} eventKey={key} title={gameName} unmountOnExit={true}>
            {getGameHeaderById(gameId)}
            <div className={styles["game-lobby"]}>{getGameById(gameId, router)}</div>
        </Tab>
    );
};

export { getGameById, getGameHeaderById, getFilteredGames, getGameTabById };
