import * as gc from "@sg/sg-game-client";
import getConfig from "next/config";
import AppSettings from "./type";

export const appSettings: AppSettings = getConfig().publicRuntimeConfig.appSettings;

export const getSiteConfig = (gameId: number) => {
    const gameSetting = appSettings.gameSettings[gameId];
    const config: gc.Configs.SiteConfigs = {
        isDev: false,
        systemType: appSettings.systemType,
        serverDomain: appSettings.serverDomain,
        ssl: appSettings.ssl,
        subDomain: appSettings.subDomain,
        env: appSettings.env,
        enableMsgpackParserAllGames: appSettings.enableMsgpackParserAllGames,
        enableMsgpackParserOnNotification: appSettings.enableMsgpackParserOnNotification,
        websocket: gameSetting.websocket,
        mainObserverNamespace: gameSetting.mainObserverNamespace,
        subGuideDomain: "",
        subDirectory: appSettings.subDirectory,
        userServicePath: appSettings.userServicePath,
    };

    return config;
};

export const getGameSetting = (gameId: number) => {
    return appSettings.gameSettings[gameId];
};

export const getGameSettingIds = () => {
    const gameSettings = Object.keys(appSettings.gameSettings).map((value) => {
        return appSettings.gameSettings[value];
    });
    const orderedGameSettings = gameSettings.sort((a, b) => a.order - b.order);

    return orderedGameSettings.map((value) => {
        return value.id;
    });
};

export default appSettings;
