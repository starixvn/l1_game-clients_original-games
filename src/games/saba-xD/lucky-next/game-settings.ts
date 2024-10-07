import * as gc from "@sg/sg-game-client";
import { getGameSetting, getSiteConfig } from "../../../_shared/app-settings";
import { GameIds } from "../../../_shared/constants";
import { sharedContainer } from "../../../_shared/components/game-base/startup";

export const setting = getGameSetting(GameIds.LuckyNext);
export const siteConfigs = getSiteConfig(GameIds.LuckyNext);

export const containerOptions: gc.IContainerOptions = gc.getGameTurnBaseContainer(setting, siteConfigs, sharedContainer);
