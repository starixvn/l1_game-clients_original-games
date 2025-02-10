import * as gc from "@sg/sg-game-client";
import getConfig from "next/config";
import AppSettings from "./type";

export const appSettings: AppSettings = getConfig().publicRuntimeConfig.appSettings;
console.log("[AppSettings] Loaded app settings:", {
    systemType: appSettings.systemType,
    env: appSettings.env,
    serverDomain: appSettings.serverDomain,
    subDirectory: appSettings.subDirectory,
});

export const getSiteConfig = (gameId: number) => {
    console.log(`[AppSettings] Getting site config for gameId: ${gameId}`);
    const gameSetting = appSettings.gameSettings[gameId];

    if (!gameSetting) {
        console.warn(`[AppSettings] No game settings found for gameId: ${gameId}`);
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

    console.log(`[AppSettings] Generated site config:`, {
        env: config.env,
        systemType: config.systemType,
        websocket: config.websocket,
        mainObserverNamespace: config.mainObserverNamespace
    });

    return config;
};

export const getGameSetting = (gameId: number) => {
    console.log(`[AppSettings] Getting game settings for gameId: ${gameId}`);
    const settings = appSettings.gameSettings[gameId];

    if (!settings) {
        console.warn(`[AppSettings] No game settings found for gameId: ${gameId}`);
        return null;
    }

    console.log(`[AppSettings] Found game settings:`, {
        id: settings.id,
        order: settings.order,
        websocket: settings.websocket
    });

    return settings;
};

export const getGameSettingIds = () => {
    console.log('[AppSettings] Getting ordered game setting IDs');
    const gameSettings = Object.keys(appSettings.gameSettings).map((value) => {
        return appSettings.gameSettings[value];
    });
    const orderedGameSettings = gameSettings.sort((a, b) => a.order - b.order);

    const ids = orderedGameSettings.map((value) => value.id);
    console.log('[AppSettings] Ordered game setting IDs:', ids);

    return ids;
};

export default appSettings;
