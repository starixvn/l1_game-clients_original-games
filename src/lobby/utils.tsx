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
    console.log(`[getGameById] Attempting to get game component for gameId: ${gameId}`);

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

    const game = games[gameId];
    if (!game) {
        console.warn(`[getGameById] No game component found for gameId: ${gameId}`);
    } else {
        console.log(`[getGameById] Successfully retrieved game component for gameId: ${gameId}`);
    }
    return game;
};

const getGameHeaderById = (gameId: number) => {
    console.log(`[getGameHeaderById] Attempting to get game header for gameId: ${gameId}`);

    const gameHeader = {
        [settingsSeDie.id]: <SeDie.Header />,
        [settingsBigSmall.id]: <BigSmall.Header />,
        [settingsLuckyNext.id]: <LuckyNext.Header />,
        [settingsSicBall.id]: <SicBall.Header />,
        [settingsVipSeDie.id]: <VipSeDie.Header />,
    };

    const header = gameHeader[gameId];
    if (!header) {
        console.warn(`[getGameHeaderById] No header component found for gameId: ${gameId}`);
    } else {
        console.log(`[getGameHeaderById] Successfully retrieved header component for gameId: ${gameId}`);
    }
    return header;
};

const getFilteredGames = (
    offerGames: {
        gameId: number;
    }[]
) => {
    console.log(`[getFilteredGames] Starting to filter games. Total offer games: ${offerGames.length}`);
    console.log('[getFilteredGames] Offer games:', offerGames);

    const gameSettingIds = getGameSettingIds();
    console.log(`[getFilteredGames] Available game setting IDs: ${gameSettingIds.join(', ')}`);

    const filteredGames = gameSettingIds
        .filter((gameId) => {
            const found = offerGames.find((offerGame) => offerGame.gameId === gameId);
            if (!found) {
                console.log(`[getFilteredGames] Filtering out gameId: ${gameId} - not found in offer games`);
            }
            return found;
        })
        .map((gameId) => {
            console.log(`[getFilteredGames] Including gameId: ${gameId} in filtered results`);
            return { gameId };
        });

    console.log(`[getFilteredGames] Filtered games result count: ${filteredGames.length}`);
    return filteredGames;
};

const getGameTabById = (gameId: number, router: NextRouter, isRenderGame: boolean) => {
    console.log(`[getGameTabById] Creating game tab for gameId: ${gameId}, isRenderGame: ${isRenderGame}`);

    const gameSetting = getGameSetting(gameId);
    if (!gameSetting) {
        console.warn(`[getGameTabById] No game settings found for gameId: ${gameId}`);
        return null;
    }

    const gameName = gc.Translator.t(`${gameSetting.gameName}.game_name`);
    const key = gameSetting.mainObserverNamespace;

    console.log(`[getGameTabById] Creating tab with gameName: ${gameName}, namespace: ${key}`);

    return (
        <Tab key={gameId} eventKey={gameId} title={gameName} unmountOnExit={true}>
            {getGameHeaderById(gameId)}
            {isRenderGame && <div className={styles["game-lobby"]}>{getGameById(gameId, router)}</div>}
        </Tab>
    );
};

export { getFilteredGames, getGameHeaderById, getGameTabById };
