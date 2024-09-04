import * as gc from "@sg/sg-game-client";
import { getGameSetting, getSiteConfig } from "../../_shared/app-settings";
import { GameIds } from "../../_shared/constants";

export const settingsSeDie = getGameSetting(GameIds.SeDie);
export const siteConfigs = getSiteConfig(GameIds.SeDie);

export const containerOptions: gc.IContainerOptions = {
    onContainerCreated: (container) => {
        container.bind(gc.GameConfigs.GameSetting).toConstantValue(settingsSeDie);
        container.bind(gc.Configs.SiteConfigs).toConstantValue(siteConfigs);
    },
    features: [...gc.defaultFeatures, gc.BetDetailsNew],
};
