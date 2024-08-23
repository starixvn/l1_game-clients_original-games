import * as gc from "@sg/sg-game-client";
import { getGameSetting, getSiteConfig } from "../../_shared/app-settings";
import { getSharedContainer } from "../../components/game-base/startup";

export const BigSmallId = 1;
export const settings = getGameSetting(BigSmallId);
export const siteConfigs = getSiteConfig(BigSmallId);
const sharedContainer = getSharedContainer(siteConfigs);

export const containerOptions: gc.IContainerOptions = {
    globalContainer: sharedContainer,
    onContainerCreated: (container) => {
        container.bind(gc.GameConfigs.GameSetting).toConstantValue(settings);
    },
    features: [...gc.defaultFeatures, gc.BetDetailsNew],
};
