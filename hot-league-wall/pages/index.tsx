import React from 'react';
import { useEffect } from 'react';
import Head from 'next/head';
import SabaGamesGroup from '../src/index';
import { PLATFORM_TYPE_MAPPING, PLATFORM_TYPE_NUMBER } from '../constant/app';

export default function Home() {
    // Default props for the SabaGamesGroup component
    const defaultProps = {
        isDarkMode: false,
        platformType: PLATFORM_TYPE_NUMBER.DESKTOP,
        token: '',
        appEnv: process.env.NODE_ENV || 'development',
        siteId: '',
        language: 'en',
        updateBalanceCallback: null,
        onRequestSSOToken: undefined
    };

    return (
        <>
            <Head>
                <title>Saba Games</title>
                <meta name="description" content="Hot League Wall - A standalone React application for gaming" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <div style={{ background: 'yellow', color: 'black', padding: 8, fontWeight: 'bold' }}>DEBUG: index.tsx is rendering</div>
                <SabaGamesGroup {...defaultProps} />
            </main>
        </>
    );
} 