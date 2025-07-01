// eslint-disable-next-line no-unused-vars
import React from "react";
import Head from "next/head";
import PreviewNextJS from "../src/preview-nextjs";

PreviewPage.getInitialProps = async () => {
  return { props: {} };
};

export default function PreviewPage() {
  return (
    <>
      <Head>
        <title>Saba Games - Preview</title>
        <meta name="description" content="Hot League Wall - Preview Mode" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <PreviewNextJS />
      </main>
    </>
  );
}
