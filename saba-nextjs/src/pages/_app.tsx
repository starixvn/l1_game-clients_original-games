import "reflect-metadata";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.scss";
import "../_shared/utils/string-helper";
import { AppProps } from "next/app";
import { loadI18n } from "../i18n";
import * as gc from "@sg/sg-game-client";
import appSettings from "../_shared/app-settings";
import { locales } from "../_shared/constants";

loadI18n(locales.en);
gc.sentryLogger.start(appSettings.sentry.dsn, appSettings.sentry.environment, "game-client-direct");

const App = (appProps: AppProps) => {
    const { Component, pageProps } = appProps;

    return <Component {...pageProps} />;
};

export default App;
