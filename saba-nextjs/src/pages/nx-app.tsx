import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function NxAppPage() {
    const [html, setHtml] = useState<string>('');

    useEffect(() => {
        // Fetch the built Nx app's HTML
        fetch('/nx-app/index.html')
            .then((res) => res.text())
            .then((data) => {
                // Remove any existing head and body tags since we're embedding in Next.js
                const cleanedHtml = data
                    .replace(/<html[^>]*>|<\/html>/gi, '')
                    .replace(/<head[^>]*>.*<\/head>/gi, '')
                    .replace(/<body[^>]*>|<\/body>/gi, '');
                setHtml(cleanedHtml);
            })
            .catch((error) => {
                console.error('Error loading Nx app:', error);
            });
    }, []);

    return (
        <>
            <Head>
                <title>Nx App Integration</title>
            </Head>
            <div
                id="nx-app-root"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </>
    );
} 