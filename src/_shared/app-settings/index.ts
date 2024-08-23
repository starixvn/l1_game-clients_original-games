import * as gc from "@sg/sg-game-client";
import getConfig from "next/config";

import AppSettings from "./type";

const getAppSettings: AppSettings = getConfig().publicRuntimeConfig;

export const getSiteConfig = (gameId: number) => {
    const gameSetting = getAppSettings.gameSettings[gameId];
    const config: gc.Configs.SiteConfigs = {
        isDev: false, // if this property is true, then you should add token=anything into the querytring to sso to the game http://localhost:7456/?token=anything
        systemType: "SG",
        serverDomainMapper: getAppSettings.serverDomainMapper,
        ssl: getAppSettings.ssl,
        subDomain: getAppSettings.subDomain,
        env: getAppSettings.env,
        enableMsgpackParserAllGames: getAppSettings.enableMsgpackParserAllGames,
        enableMsgpackParserOnNotification: getAppSettings.enableMsgpackParserOnNotification,
        websocket: gameSetting.websocket,
        mainObserverNamespace: gameSetting.mainObserverNamespace,
        storagePrefixKey: gameSetting.storagePrefixKey,
        subGuideDomain: gameSetting.storagePrefixKey,
    };

    gc.Shared.utils.StorageManager.setPrefixKey(gameSetting.storagePrefixKey);
    console.log("config", config);

    return config;
};

export const getGameSetting = (gameId: number) => {
    return getAppSettings.gameSettings[gameId];
};

export default getAppSettings;
