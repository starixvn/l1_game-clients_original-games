import * as gc from "@sg/sg-game-client";
import getConfig from "next/config";

import AppSettings from "./type";

const appSettings: AppSettings = getConfig().publicRuntimeConfig;

export const getSiteConfig = (gameId: number) => {
    const gameSetting = appSettings.gameSettings[gameId];
    const config: gc.Configs.SiteConfigs = {
        isDev: false, // if this property is true, then you should add token=anything into the querytring to sso to the game http://localhost:7456/?token=anything
        systemType: "SG",
        serverDomain: appSettings.serverDomain,
        ssl: appSettings.ssl,
        subDomain: appSettings.subDomain,
        env: appSettings.env,
        enableMsgpackParserAllGames: appSettings.enableMsgpackParserAllGames,
        enableMsgpackParserOnNotification: appSettings.enableMsgpackParserOnNotification,
        websocket: gameSetting.websocket,
        mainObserverNamespace: gameSetting.mainObserverNamespace,
        storagePrefixKey: gameSetting.storagePrefixKey,
        subGuideDomain: "",
        subDirectory: appSettings.subDirectory,
    };

    gc.Shared.utils.StorageManager.setPrefixKey(gameSetting.storagePrefixKey);

    return config;
};

export const getGameSetting = (gameId: number) => {
    return appSettings.gameSettings[gameId];
};

export default appSettings;
