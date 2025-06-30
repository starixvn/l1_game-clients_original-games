import React from 'react';
import type { AppProps } from 'next/app';
import { ErrorBoundary } from 'react-error-boundary';
import '../src/styles/main.scss';
import '../src/style.scss';
import '../src/_shared/utils/string-helper';

const ErrorFallback = ({ error }: { error: Error }) => {
    console.error('Error in application:', error);
    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
        </div>
    );
};

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Component {...pageProps} />
        </ErrorBoundary>
    );
} 