import "reflect-metadata";
import * as gc from "@sg/sg-game-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/main.scss";
import * as mobx from "mobx";
import { appWithTranslation } from "next-i18next";
import { AppProps } from "next/app";
import * as Observer from "observer";
import { sharedContainer } from "../components/game-base/startup";

Observer.configure({ default: { mobx, container: gc.buildObserverContainer(sharedContainer) } });

const App = (appProps: AppProps) => {
    const { Component, pageProps } = appProps;

    return <Component {...pageProps} />;
};

// enableLogging();

export default appWithTranslation(App);
