import * as gc from "@sg/sg-game-client";
import getConfig from "next/config";
import AppSettings from "./type";

export const appSettings: AppSettings = getConfig().publicRuntimeConfig.appSettings;

export const getSiteConfig = (gameId: number) => {
    const gameSetting = appSettings.gameSettings[gameId];

    if (!gameSetting) {
        throw new Error(`Game settings not found for gameId: ${gameId}`);
    }

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
    const settings = appSettings.gameSettings[gameId];

    if (!settings) {
        return null;
    }

    return settings;
};

export const getGameSettingIds = (visibleOnly: boolean = true) => {
    const gameSettings = Object.keys(appSettings.gameSettings).map((value) => {
        return appSettings.gameSettings[value];
    });

    const filteredSettings = visibleOnly
        ? gameSettings.filter(setting => setting.isVisible)
        : gameSettings;

    const orderedGameSettings = filteredSettings.sort((a, b) => a.order - b.order);

    const ids = orderedGameSettings.map((value) => value.id);
    return ids;
};

export const getVisibleGameSettings = () => {
    const gameSettings = Object.keys(appSettings.gameSettings).map((value) => {
        return appSettings.gameSettings[value];
    });

    return gameSettings
        .filter(setting => setting.isVisible)
        .sort((a, b) => a.order - b.order);
};

export default appSettings;
