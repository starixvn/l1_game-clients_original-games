import "reflect-metadata";
import * as gc from "@sg/sg-game-client";
import "bootstrap/dist/css/bootstrap.min.css";
import * as mobx from "mobx";
import { appWithTranslation } from "next-i18next";
import { AppProps } from "next/app";
import * as Observer from "observer";
import { sharedContainer, startGame } from "../components/game-base/startup";
import { containerOptions, settings, siteConfigs } from "../games/sedie/game-settings";

Observer.configure({ default: { mobx, container: gc.buildObserverContainer(sharedContainer) } });

startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);

const App = (appProps: AppProps) => {
    const { Component, pageProps } = appProps;

    return <Component {...pageProps} />;
};

// enableLogging();

export default appWithTranslation(App);
