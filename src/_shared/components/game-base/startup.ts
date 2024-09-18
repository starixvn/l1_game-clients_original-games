import * as gc from "@sg/sg-game-client";
import * as Observer from "@sg/sg-observer";
import * as mobx from "mobx";
import { reaction } from "mobx";
import "reflect-metadata";
import { getSiteConfig } from "../../app-settings";
import { Lobby } from "../../states";
interface Languages {
    [key: string]: any;
}

declare global {
    interface Window {
        languages: Languages;
    }
}

function getSharedContainer(siteConfigs: gc.Configs.SiteConfigs) {
    const containerOptions: gc.IContainerOptions = {
        onContainerCreated: (container) => {
            container.bind(gc.Configs.SiteConfigs).toConstantValue(siteConfigs);
        },
        enabledFeatures: [
            gc.Player.FEATURE_NAME,
            gc.Auth.FEATURE_NAME,
            gc.App.FEATURE_NAME,
            gc.Notification.FEATURE_NAME,
            gc.ConnectSite.FEATURE_NAME,
            gc.ChipSetting.FEATURE_NAME,
            Lobby.FEATURE_NAME,
        ],
        features: [...gc.defaultFeatures, Lobby],
    };

    return gc.getContainer(containerOptions);
}

export const sharedContainer = getSharedContainer(getSiteConfig(2));

export function configSharedContainer() {
    Observer.configure({ default: { mobx, container: gc.buildObserverContainer(sharedContainer) } });
    return sharedContainer;
}

export function configGameContainer(gameName: string, containerOptions: gc.IContainerOptions, siteConfigs: gc.Configs.SiteConfigs) {
    gc.StorageManager.setPrefixKey(siteConfigs.storagePrefixKey || "");

    const container = gc.getContainer(containerOptions);
    const observerContainer = gc.buildObserverContainer(container);

    Observer.configure({ [gameName]: { mobx: { reaction }, container: observerContainer } });

    return container;
}
