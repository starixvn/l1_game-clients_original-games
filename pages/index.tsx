// eslint-disable-next-line no-unused-vars
import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import "../src/styles/plinko/plinko.scss";

// Dynamically import the PlinkoGamePage with SSR disabled
const PlinkoGamePage = dynamic(
  () =>
    import("../src/games/plinko").then((mod) => ({
      default: mod.PlinkoGamePage,
    })),
  {
    ssr: false,
    loading: () => <div>Loading Plinko Game...</div>,
  }
);

export default function Home() {
  return (
    <>
      <Head>
        <title>Plinko Game</title>
        <meta name="description" content="Plinko Game - Main Game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div
          style={{
            background: "green",
            color: "white",
            padding: 8,
            fontWeight: "bold",
          }}
        >
          MAIN: Plinko Game (Root)
        </div>
        <div className="plinko-page">
          <PlinkoGamePage />
        </div>
      </main>
    </>
  );
}
