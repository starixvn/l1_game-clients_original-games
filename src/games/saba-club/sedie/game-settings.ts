import * as gc from "@sg/sg-game-client";
import { getGameSetting, getSiteConfig } from "../../../_shared/app-settings";
import { sharedContainer } from "../../../_shared/components/game-base/startup";
import { GameIds } from "../../../_shared/constants";

// Get game settings
export const setting = getGameSetting(GameIds.SeDie);
if (!setting) {
    throw new Error(`Game settings not found for SeDie (ID: ${GameIds.SeDie})`);
}

// Get site configs
export const siteConfigs = getSiteConfig(GameIds.SeDie);
if (!siteConfigs) {
    throw new Error(`Site configs not found for SeDie (ID: ${GameIds.SeDie})`);
}

// Initialize container options with required dependencies
export const containerOptions: gc.IContainerOptions = gc.getGameContainer(setting, siteConfigs, sharedContainer);

// Validate observer namespace
if (!setting.mainObserverNamespace) {
    throw new Error(`Main observer namespace not configured for SeDie (ID: ${GameIds.SeDie})`);
}

// Export namespace for convenience
export const OBSERVER_NAMESPACE = setting.mainObserverNamespace;
