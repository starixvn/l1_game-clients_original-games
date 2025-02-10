import * as gc from "@sg/sg-game-client";
import { NextRouter } from "next/router";
import { Tab } from "react-bootstrap";
import { getGameSetting, getGameSettingIds } from "../_shared/app-settings";
import { BigSmall, SeDie, VipSeDie } from "../games/saba-club";
import { LuckyNext, SicBall } from "../games/saba-xD";
import styles from "./lobby.module.scss";

// Initialize settings
const settingsSeDie = SeDie.Setting.setting;
const settingsBigSmall = BigSmall.Setting.setting;
const settingsSicBall = SicBall.Setting.setting;
const settingsLuckyNext = LuckyNext.Setting.setting;
const settingsVipSeDie = VipSeDie.Setting.setting;

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
        [settingsVipSeDie.id]: <VipSeDie.Page router={router} namespace={settingsVipSeDie.mainObserverNamespace} />,
    };

    return games[gameId];
};

const getGameHeaderById = (gameId: number) => {
    const gameHeader = {
        [settingsSeDie.id]: <SeDie.Header />,
        [settingsBigSmall.id]: <BigSmall.Header />,
        [settingsLuckyNext.id]: <LuckyNext.Header />,
        [settingsSicBall.id]: <SicBall.Header />,
        [settingsVipSeDie.id]: <VipSeDie.Header />,
    };

    return gameHeader[gameId];
};

const getFilteredGames = (
    offerGames: {
        gameId: number;
    }[]
) => {
    const gameSettingIds = getGameSettingIds();

    const filteredGames = gameSettingIds
        .filter((gameId) => {
            const found = offerGames.find((offerGame) => offerGame.gameId === gameId);
            return found;
        })
        .map((gameId) => {
            return { gameId };
        });

    return filteredGames;
};

const getGameTabById = (gameId: number, router: NextRouter, isRenderGame: boolean) => {
    const gameSetting = getGameSetting(gameId);
    if (!gameSetting) {
        return null;
    }

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
