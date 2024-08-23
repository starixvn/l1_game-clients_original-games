import * as gc from "@sg/sg-game-client";
import * as mobx from "mobx";
import * as Observer from "observer";
import "reflect-metadata";

interface Languages {
    [key: string]: any;
}

declare global {
    interface Window {
        languages: Languages;
    }
}

const loadI18n = (siteConfigs: gc.Configs.SiteConfigs, namespaces: string[]) => {
    try {
        const isUseTolgeeRealTime = !!siteConfigs.tolgeeUrl;
        const languageId = gc.Translator.getLanguageId();
        const languageCodes = ["en", "id", "th", "vi", "zh_cn", "zh_tw"];
        const translationOptions: gc.Shared.utils.TranslationOptions = {
            languageId: languageId,
            tolgeeUrl: siteConfigs.tolgeeUrl,
            isUseTolgeeRealTime: isUseTolgeeRealTime,
            getStaticData: (languageId) => {
                return window["languages"][languageId];
            },
            availableLanguages: languageCodes,
            onLoaded: () => {
                console.log("started tolgee");
            },
            gameNamespaces: namespaces,
        };

        gc.Translator.init(translationOptions);
    } catch (e) {
        console.log(e);
    }
};

export function startGame(
    gameName: string,
    containerOptions: gc.IContainerOptions,
    siteConfigs: gc.Configs.SiteConfigs,
    namespaces?: string[]
) {
    gc.StorageManager.setPrefixKey(siteConfigs.storagePrefixKey || "");
    loadI18n(siteConfigs, namespaces ? namespaces : [gameName]);

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
