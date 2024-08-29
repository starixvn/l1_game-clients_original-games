import * as gc from "@sg/sg-game-client";
import { makeAutoObservable, reaction } from "mobx";
import * as Observer from "observer";
import "reflect-metadata";
import { getSiteConfig } from "../../_shared/app-settings";
import * as mobx from "mobx";

interface Languages {
    [key: string]: any;
}

declare global {
    interface Window {
        languages: Languages;
    }
}

export function getSharedContainer(siteConfigs: gc.Configs.SiteConfigs) {
    const containerOptions: gc.IContainerOptions = {
        onContainerCreated: (container) => {
            container.bind(gc.Configs.SiteConfigs).toConstantValue(siteConfigs);
            container.bind("makeAutoObservable").toFunction(makeAutoObservable);
        },
        enabledFeatures: [
            gc.Player.FEATURE_NAME,
            gc.Auth.FEATURE_NAME,
            gc.App.FEATURE_NAME,
            gc.Notification.FEATURE_NAME,
            gc.ConnectSite.FEATURE_NAME,
            gc.ChipSetting.FEATURE_NAME,
        ],
    };

    return gc.getContainer(containerOptions);
}

const sharedContainer = getSharedContainer(getSiteConfig(2));

export function configSharedContainer() {
    Observer.configure({ default: { mobx, container: gc.buildObserverContainer(sharedContainer) } });
}

export function configGameContainer(gameName: string, containerOptions: gc.IContainerOptions, siteConfigs: gc.Configs.SiteConfigs) {
    gc.StorageManager.setPrefixKey(siteConfigs.storagePrefixKey || "");

    containerOptions.globalContainer = sharedContainer;
    const container = gc.getContainer(containerOptions);
    const observerContainer = gc.buildObserverContainer(container);

    Observer.configure({ [gameName]: { mobx: { reaction }, container: observerContainer } });

    return container;
}
