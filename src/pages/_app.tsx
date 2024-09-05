import "reflect-metadata";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.scss";
import "../_shared/utils/string-helper";
import { AppProps } from "next/app";
import { loadI18n } from "../i18n";
import * as gc from "@sg/sg-game-client";
import appSettings from "../_shared/app-settings";

/*
const languageMapping = {
    "vi-VN": "vi",
    "en-US": "en",
    "en-UK": "en",
    "th-TH": "th",
    "id-ID": "id",
    "zh-CN": "zh_cn",
    "zh-TW": "zh_tw",
};
*/
loadI18n(gc.Translator.toLanguageId("vi-VN"));
gc.sentryLogger.start(appSettings.sentry.dsn, appSettings.sentry.environment, "game-client-direct");

const App = (appProps: AppProps) => {
    const { Component, pageProps } = appProps;

    return <Component {...pageProps} />;
};

export default App;
