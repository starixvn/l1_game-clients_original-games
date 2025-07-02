// eslint-disable-next-line no-unused-vars
import React from "react";
import dynamic from "next/dynamic";

// Dynamically import the CrashGamePage with SSR disabled
const CrashGamePage = dynamic(
  () => import("../src/games/crash").then((mod) => mod.CrashGamePage),
  {
    ssr: false,
    loading: () => <div>Loading Crash Game...</div>,
  }
);

const SpaceFlightPage = () => {
  return (
    <div className="space-flight-page">
      <CrashGamePage />
    </div>
  );
};

export default SpaceFlightPage;
