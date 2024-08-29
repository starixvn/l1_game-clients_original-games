import "reflect-metadata";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/main.scss";
import { appWithTranslation } from "next-i18next";
import { AppProps } from "next/app";
import { configSharedContainer } from "../components/game-base/startup";

configSharedContainer();

const App = (appProps: AppProps) => {
    const { Component, pageProps } = appProps;

    return <Component {...pageProps} />;
};

// enableLogging();

export default appWithTranslation(App);
