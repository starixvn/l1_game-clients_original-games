import * as gc from "@sg/sg-game-client";
import { getGameSetting, getSiteConfig } from "../../_shared/app-settings";
import { getSharedContainer } from "../../components/game-base/startup";

export const SeDieId = 2;
export const settings = getGameSetting(SeDieId);
export const siteConfigs = getSiteConfig(SeDieId);
const sharedContainer = getSharedContainer(siteConfigs);

export const containerOptions: gc.IContainerOptions = {
    globalContainer: sharedContainer,
    onContainerCreated: (container) => {
        container.bind(gc.GameConfigs.GameSetting).toConstantValue(settings);
    },
    features: [...gc.defaultFeatures, gc.BetDetailsNew],
};
