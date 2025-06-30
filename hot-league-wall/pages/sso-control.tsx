import Head from 'next/head';
import PreviewNextJS from '../src/preview-nextjs';

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