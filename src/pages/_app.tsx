import { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";

const App = (appProps: AppProps) => {
    const { Component, pageProps } = appProps;

    return <Component {...pageProps} />;
};

export default appWithTranslation(App);
