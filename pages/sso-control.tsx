// eslint-disable-next-line no-unused-vars
import React from "react";
import Head from "next/head";
import PreviewNextJS from "../src/preview-nextjs";

SSOControlPage.getInitialProps = async () => {
  return { props: {} };
};

export default function SSOControlPage() {
  return (
    <>
      <Head>
        <title>SSO Control - Saba Games</title>
        <meta name="description" content="SSO Control Panel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <PreviewNextJS />
      </main>
    </>
  );
}
