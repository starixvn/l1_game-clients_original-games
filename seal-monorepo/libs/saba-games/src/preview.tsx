import { useEffect, useState} from 'react';
import { useSentryInit } from './saba-games-index';
import Token from './token';
import { PLATFORM_TYPE_MAPPING, PLATFORM_TYPE_NUMBER, VIVA88_SITE_ID } from '../constant/app';
import App from './app';
import { PreviewProvider, usePreviewContext } from './previewProvider';
import ProviderSetDropDown from './_shared/components/provider-set-dropdown';

const Preview = () => {
    const [token, setToken] = useState('');

    const handleTokenChange = (newToken: string) => {
        setToken(newToken);
    };
    return token ? (
        <PreviewProvider>
            <PreviewContext token={token}/>
        </PreviewProvider>
    ) : (
        <Token onTokenChange={handleTokenChange} />
    );
};

const PreviewContext = ({ token }) => {
    const { theme, isDarkMode, language } = usePreviewContext();

    const appEnv = '';
    const siteId = VIVA88_SITE_ID;
    const platformType = PLATFORM_TYPE_NUMBER.DESKTOP;
    const platform = PLATFORM_TYPE_MAPPING[platformType];
    useSentryInit();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-darkmode', isDarkMode.toString());
    }, [theme, isDarkMode]);

    return (
        <div 
            data-platform={platform}
            data-version={process.env.TAG_VERSION} 
            className={'seal-vg-sg-index'}
        >
            <ProviderSetDropDown />
            <App
                appEnv={appEnv}
                token={token}
                language={language}
                siteId={siteId}
            />
        </div>
    );
}

export default Preview;