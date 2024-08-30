import * as gc from "@sg/sg-game-client";
import { getGameSetting, getSiteConfig } from "../../_shared/app-settings";
import { GameIds } from "../../_shared/constants";

export const settings = getGameSetting(GameIds.LuckyNext);
export const siteConfigs = getSiteConfig(GameIds.LuckyNext);

export const containerOptions: gc.IContainerOptions = {
    onContainerCreated: (container) => {
        container.bind(gc.GameConfigs.GameSetting).toConstantValue(settings);
        // container.bind(gc.TurnBase.TurnBaseTimeStore).toConstantValue(gc.TurnBase.TurnBaseTimeStore as any);
        // container.bind(gc.TurnBase.TurnBaseTimeHandlers).toConstantValue(gc.TurnBase.TurnBaseTimeHandlers as any);
        // container.bind(gc.TurnBase.TurnBaseHandlers).toConstantValue(gc.TurnBase.TurnBaseHandlers as any);
        // container.bind(gc.TurnBase.TurnBaseRunningHandlers).toConstantValue(gc.TurnBase.TurnBaseRunningHandlers as any);
        // container.bind(gc.TurnBase.TurnBaseStore).toConstantValue(gc.TurnBase.TurnBaseStore as any);
    },
    features: [...gc.defaultFeatures, gc.BetDetailsNew],
};
