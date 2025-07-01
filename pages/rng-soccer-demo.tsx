// eslint-disable-next-line no-unused-vars
import React from "react";
import Head from "next/head";
import RngSoccerDemo from "../src/games/saba-club/rng-soccer/prototype/rng-soccer-demo";

export default function RngSoccerDemoPage() {
  return (
    <>
      <Head>
        <title>RNG Soccer Demo - Saba Games</title>
        <meta name="description" content="RNG Soccer Demo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <RngSoccerDemo />
      </main>
    </>
  );
}
