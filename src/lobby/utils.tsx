import * as gc from "@sg/sg-game-client";
import { NextRouter } from "next/router";
import { Tab } from "react-bootstrap";
import { getGameSetting, getGameSettingIds } from "../_shared/app-settings";
import { BigSmall, SeDie } from "../games/saba-club";
import { LuckyNext, SicBall } from "../games/saba-xD";
import styles from "./lobby.module.scss";

const settingsSeDie = SeDie.Setting.setting;
const settingsBigSmall = BigSmall.Setting.setting;

const settingsSicBall = SicBall.Setting.setting;
const settingsLuckyNext = LuckyNext.Setting.setting;
const getGameById = (gameId: number, router: NextRouter) => {
    const games: { [x: number]: JSX.Element } = {
        [settingsSeDie.id]: <SeDie.Page router={router} namespace={settingsSeDie.mainObserverNamespace} />,
        [settingsBigSmall.id]: <BigSmall.Page router={router} namespace={settingsBigSmall.mainObserverNamespace} />,
        [settingsLuckyNext.id]: (
            <LuckyNext.Page
                router={router}
                namespace={settingsLuckyNext.mainObserverNamespace}
                overrideClasses={styles["lucky-next-block-wrapper"]}
            />
        ),
        [settingsSicBall.id]: <SicBall.Page router={router} namespace={settingsSicBall.mainObserverNamespace} />,
    };
    return games[gameId];
};

const getGameHeaderById = (gameId: number) => {
    const gameHeader = {
        [settingsSeDie.id]: <SeDie.Header />,
        [settingsBigSmall.id]: <BigSmall.Header />,
        [settingsLuckyNext.id]: <LuckyNext.Header />,
        [settingsSicBall.id]: <SicBall.Header />,
    };
    return gameHeader[gameId];
};

const getFilteredGames = (
    offerGames: {
        gameId: number;
    }[]
) => {
    return getGameSettingIds()
        .filter((gameId) => offerGames.find((offerGame) => offerGame.gameId === gameId))
        .map((gameId) => {
            return { gameId };
        });
};

const getGameTabById = (gameId: number, router: NextRouter, isRenderGame: boolean) => {
    const gameSetting = getGameSetting(gameId);

    const gameName = gc.Translator.t(`${gameSetting.gameName}.game_name`);
    const key = gameSetting.mainObserverNamespace;
    return (
        <Tab key={gameId} eventKey={gameId} title={gameName} unmountOnExit={true}>
            {getGameHeaderById(gameId)}
            {isRenderGame && <div className={styles["game-lobby"]}>{getGameById(gameId, router)}</div>}
        </Tab>
    );
};

export { getFilteredGames, getGameHeaderById, getGameTabById };
