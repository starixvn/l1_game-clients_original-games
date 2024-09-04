import * as gc from "@sg/sg-game-client";
import { getGameSetting, getSiteConfig } from "../../_shared/app-settings";
import { GameIds } from "../../_shared/constants";

export const settingsBigSmall = getGameSetting(GameIds.BigSmall);
export const siteConfigs = getSiteConfig(GameIds.BigSmall);

export const containerOptions: gc.IContainerOptions = {
    onContainerCreated: (container) => {
        container.bind(gc.GameConfigs.GameSetting).toConstantValue(settingsBigSmall);
        container.bind(gc.Configs.SiteConfigs).toConstantValue(siteConfigs);
    },
    features: [...gc.defaultFeatures, gc.BetDetailsNew],
};
