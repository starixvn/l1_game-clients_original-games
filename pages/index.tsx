// eslint-disable-next-line no-unused-vars
import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Gaming Platform</title>
        <meta name="description" content="Gaming Platform - Choose Your Game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "20px",
            textAlign: "center",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: "3rem", marginBottom: "2rem" }}>
            Gaming Platform
          </h1>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <Link href="/plinko">
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "2rem",
                  borderRadius: "10px",
                  cursor: "pointer",
                  border: "2px solid rgba(255, 255, 255, 0.2)",
                  transition: "all 0.3s ease",
                  minWidth: "200px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                }}
              >
                <h2 style={{ marginBottom: "1rem" }}>🎯 Plinko Game</h2>
                <p>Classic ball drop game with multipliers</p>
              </div>
            </Link>
            <Link href="/space-flight">
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "2rem",
                  borderRadius: "10px",
                  cursor: "pointer",
                  border: "2px solid rgba(255, 255, 255, 0.2)",
                  transition: "all 0.3s ease",
                  minWidth: "200px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                }}
              >
                <h2 style={{ marginBottom: "1rem" }}>
                  🚀 Space Flight (Crash)
                </h2>
                <p>Exciting crash game with real-time betting</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
