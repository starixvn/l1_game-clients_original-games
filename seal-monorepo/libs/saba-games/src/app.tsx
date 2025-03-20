import './styles/main.scss';
import './_shared/utils/string-helper';
import { loadI18n } from './i18n';
import Lobby from './lobby/lobby';
import { AppProvider, useAppContext } from './appProvider';
import { MainArea } from './main-area';

interface AppProps extends AppContentProps {
    appEnv: string;
    siteId: string;
    language: string;
}

interface AppContentProps {
    token: string;
}

const App = ({ appEnv, token, language, siteId }: AppProps) => {
    return (
        <AppProvider appEnv={appEnv} language={language} siteId={siteId}>
            <AppContent token={token} />
        </AppProvider>
    );
};

const AppContent = ({ token }: AppContentProps) => {
    const { language } = useAppContext();

    loadI18n(language);
    return (
        <MainArea>
            <div data-react="true" style={{ width: '100%' }}>
                {token && <Lobby token={token} />}
            </div>
        </MainArea>
    );
};

export default App;
