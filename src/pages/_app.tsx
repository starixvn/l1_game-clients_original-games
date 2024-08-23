import "reflect-metadata";
import * as gc from "@sg/sg-game-client";
import * as mobx from "mobx";
import { enableLogging } from "mobx-logger";
import { appWithTranslation } from "next-i18next";
import { AppProps } from "next/app";
import * as Observer from "observer";
import { getSiteConfig } from "../_shared/app-settings";
import { getSharedContainer } from "../components/game-base/startup";

const sharedContainer = getSharedContainer(getSiteConfig(2));

Observer.configure({ default: { mobx, container: gc.buildObserverContainer(sharedContainer) } });

const App = (appProps: AppProps) => {
    const { Component, pageProps } = appProps;

    return <Component {...pageProps} />;
};

enableLogging();

export default appWithTranslation(App);
