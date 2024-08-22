import { enableLogging } from "mobx-logger";
import { appWithTranslation } from "next-i18next";
import { AppProps } from "next/app";

const App = (appProps: AppProps) => {
    const { Component, pageProps } = appProps;

    return <Component {...pageProps} />;
};
enableLogging();

export default appWithTranslation(App);
