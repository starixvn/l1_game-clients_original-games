// eslint-disable-next-line no-unused-vars
import React from "react";
import Head from "next/head";
import SabaGamesGroup from "../src/index";
import { PLATFORM_TYPE_NUMBER } from "../constant/app";

export default function RngSoccerPage() {
  // Default props for the SabaGamesGroup component
  const defaultProps = {
    isDarkMode: false,
    platformType: PLATFORM_TYPE_NUMBER.DESKTOP,
    token: "",
    appEnv: process.env.NODE_ENV || "development",
    siteId: "",
    language: "en",
    updateBalanceCallback: null,
    onRequestSSOToken: undefined,
  };

  return (
    <>
      <Head>
        <title>RNG Soccer Game</title>
        <meta name="description" content="RNG Soccer Game - Hot League Wall" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div
          style={{
            background: "blue",
            color: "white",
            padding: 8,
            fontWeight: "bold",
          }}
        >
          RNG SOCCER: /rng-soccer route
        </div>
        <SabaGamesGroup {...defaultProps} />
      </main>
    </>
  );
}
