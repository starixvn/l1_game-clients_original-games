import * as gc from "@sg/sg-game-client";
import { getGameSetting, getSiteConfig } from "../../_shared/app-settings";
import { GameIds } from "../../_shared/constants";
import { sharedContainer } from "../../_shared/components/game-base/startup";

export const settingsSicball = getGameSetting(GameIds.SicBall);
export const siteConfigs = getSiteConfig(GameIds.SicBall);

export const containerOptions: gc.IContainerOptions = {
    globalContainer: sharedContainer,
    onContainerCreated: (container) => {
        container.bind(gc.GameConfigs.GameSetting).toConstantValue(settingsSicball);
        container.bind(gc.Configs.SiteConfigs).toConstantValue(siteConfigs);

        gc.GameTurnBase.onContainerCreated(container);
    },
    features: [...gc.defaultFeatures, gc.BetDetailsNew],
};
