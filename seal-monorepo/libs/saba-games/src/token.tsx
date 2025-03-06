import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { Button } from 'react-bootstrap';
// import Container from 'react-bootstrap/Container';
import { requestSSO } from './_shared/utils/sso-helper';

interface TokenProps {
    onTokenChange: (token: string) => void;
}

const Token = (({ onTokenChange }) => {
    const [token, setToken] = useState('');
    const isInitialMount = useRef(true);

    const handleGetToken = useCallback(async () => {
        const result = await requestSSO();
        if (result?.token) {
            setToken(result.token);
            onTokenChange(result.token);
        }
    }, [onTokenChange]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            handleGetToken();
        }
    }, [handleGetToken]);

    return (
        <div data-react='true'>
            <div className='mt-3'>
                <button onClick={handleGetToken}>
                    Get Token
                </button>
                <div>{token && <div>Current Token: {token}</div>}</div>
            </div>
        </div>
    );
});

export default Token;
