import * as gc from "@sg/sg-game-client";
import { getGameSetting, getSiteConfig } from "../../_shared/app-settings";
import { GameIds } from "../../_shared/constants";
import { getSharedContainer } from "../../components/game-base/startup";

export const settings = getGameSetting(GameIds.SeDie);
export const siteConfigs = getSiteConfig(GameIds.SeDie);
const sharedContainer = getSharedContainer(siteConfigs);

export const containerOptions: gc.IContainerOptions = {
    globalContainer: sharedContainer,
    onContainerCreated: (container) => {
        container.bind(gc.GameConfigs.GameSetting).toConstantValue(settings);
    },
    features: [...gc.defaultFeatures, gc.BetDetailsNew],
};
