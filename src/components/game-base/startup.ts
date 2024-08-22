import gc from "@sg/game-client-core";
import mobx from "mobx";
import Observer from "observer";

export function startGame(
    gameName: string,
    containerOptions: gc.IContainerOptions,
    siteConfigs: gc.Configs.SiteConfigs,
    namespaces?: string[]
) {
    gc.StorageManager.setPrefixKey(siteConfigs.storagePrefixKey || "");

    const container = gc.getContainer(containerOptions);
    console.log("container", container);
    const observerContainer = gc.buildObserverContainer(container);
    // gc.sentryLogger.start(siteConfigs.sentryUrl, siteConfigs.env, gameName);

    Observer.configure({ [gameName]: { mobx, container: observerContainer } });

    return container;
}

export function getSharedContainer(siteConfigs: gc.Configs.SiteConfigs) {
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
        ],
    };

    return gc.getContainer(containerOptions);
}
