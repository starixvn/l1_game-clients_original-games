import { useEffect } from 'react';
import Head from 'next/head';

const SabaGamesPage = () => {
    useEffect(() => {
        // Load the built Nx app scripts
        const script = document.createElement('script');
        script.src = '/saba-games/main.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <>
            <Head>
                <title>Saba Games</title>
                <meta name="description" content="Saba Games Application" />
            </Head>
            <div id="root"></div>
        </>
    );
};

export default SabaGamesPage; 