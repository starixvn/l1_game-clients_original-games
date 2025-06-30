import './styles/main.scss';
import './_shared/utils/string-helper';
import { loadI18n } from './i18n';
import Lobby from './lobby/lobby';
import { AppProvider, useAppContext } from './appProvider';
import { SyncMemberSiteBalance } from './_shared/utils/callback-singleton/sync-member-site-balance';
import { TokenRequestManager } from './_shared/utils/callback-singleton/token-request-manager';
import { useEffect, useState, useCallback } from 'react';
import RNGSoccerStaticPrototype from './games/saba-club/rng-soccer/prototype/rng-soccer-static-prototype';

// Import simulator components
import {
    ConnectionControlSimulatorWrapper,
    useConnectionSimulator
} from './simulator';
import { useSSOSimulator } from './_shared/components/sso-control-simulator';

interface AppWithSimulatorProps {
    appEnv: string;
    siteId: string;
    language: string;
    updateBalanceCallback?: void | null;
    onRequestSSOToken?: (context: 'FIRST_SSO' | 'SSO_RETRY') => Promise<string | null>;
    enableSimulators?: boolean;
}

interface AppContentWithSimulatorProps {
    updateBalanceCallback?: void | null;
    onRequestSSOToken?: (context: 'FIRST_SSO' | 'SSO_RETRY') => Promise<string | null>;
    enableSimulators?: boolean;
}

const AppWithSimulator = ({
    appEnv,
    language,
    siteId,
    updateBalanceCallback,
    onRequestSSOToken,
    enableSimulators = true
}: AppWithSimulatorProps) => {
    return (
        <AppProvider appEnv={appEnv} language={language} siteId={siteId}>
            <AppContentWithSimulator
                updateBalanceCallback={updateBalanceCallback}
                onRequestSSOToken={onRequestSSOToken}
                enableSimulators={enableSimulators}
            />
        </AppProvider>
    );
};

const AppContentWithSimulator = ({
    updateBalanceCallback,
    onRequestSSOToken,
    enableSimulators = true
}: AppContentWithSimulatorProps) => {
    const { language } = useAppContext();
    const [hasClickedPlay, setHasClickedPlay] = useState(false);
    const [currentToken, setCurrentToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isReconnecting, setIsReconnecting] = useState(false);

    // Initialize simulators if enabled
    const ssoSimulator = useSSOSimulator();
    const connectionSimulator = useConnectionSimulator();

    // Shared token request logic with simulator integration
    const executeTokenRequest = useCallback(async (context: 'FIRST_SSO' | 'SSO_RETRY') => {
        console.log(`🔄 [${context}] Using TokenRequestManager for REAL APP...`);
        const tokenStartTime = performance.now();

        try {
            let newToken: string | null = null;

            // Check if SSO simulator is in failure mode
            if (enableSimulators && ssoSimulator.shouldSimulateFailure()) {
                console.log('🔴 [SSO_SIMULATOR] Simulating SSO failure');
                throw new Error('Simulated SSO failure');
            }

            if (onRequestSSOToken) {
                newToken = await onRequestSSOToken(context);
            } else {
                newToken = await TokenRequestManager.getInstance().executeTokenRequest();
            }

            const tokenEndTime = performance.now();
            const tokenDuration = tokenEndTime - tokenStartTime;

            if (newToken) {
                console.log(`✅ [${context}] TokenRequestManager completed for REAL APP - Duration: ${tokenDuration.toFixed(2)}ms`);
                setCurrentToken(newToken);
                return { success: true, token: newToken, duration: tokenDuration };
            } else {
                console.log(`⚠️ [${context}] TokenRequestManager returned null for REAL APP - Duration: ${tokenDuration.toFixed(2)}ms`);
                return { success: false, token: null, duration: tokenDuration };
            }
        } catch (error) {
            const tokenEndTime = performance.now();
            const tokenDuration = tokenEndTime - tokenStartTime;
            console.log(`💥 [${context}] TokenRequestManager failed for REAL APP - Duration: ${tokenDuration.toFixed(2)}ms`);
            console.error(`[${context}] TokenRequestManager error:`, error);
            return { success: false, token: null, duration: tokenDuration, error };
        }
    }, [onRequestSSOToken, enableSimulators, ssoSimulator]);

    // Unified token request handler
    const performTokenRequest = useCallback(
        async ({
            context,
            showLoading = false,
            triggerPlayTransition = false,
            showReconnectLoading = false,
        }: {
            context: 'FIRST_SSO' | 'SSO_RETRY';
            showLoading?: boolean;
            triggerPlayTransition?: boolean;
            showReconnectLoading?: boolean;
        }) => {
            if (showLoading) setIsLoading(true);
            if (showReconnectLoading) setIsReconnecting(true);
            const startTime = performance.now();
            const result = await executeTokenRequest(context);
            if (showLoading) setIsLoading(false);
            if (showReconnectLoading) setIsReconnecting(false);
            if (triggerPlayTransition && result.success) setHasClickedPlay(true);
            const endTime = performance.now();
            const duration = endTime - startTime;
            if (context === 'FIRST_SSO') {
                console.log(`🏁 [FIRST_SSO] PROTOTYPE to REAL APP transition completed - Total duration: ${duration.toFixed(2)}ms`);
            } else if (context === 'SSO_RETRY') {
                if (result.success) {
                    console.log('🔄 [SESSION_RECONNECT] New token obtained, Lobby should reconnect automatically');
                } else {
                    console.log('🔄 [SESSION_RECONNECT] Failed to get new token');
                }
            }
            return result;
        },
        [executeTokenRequest]
    );

    const handlePlayButtonClick = useCallback(
        async () => {
            await performTokenRequest({ context: 'FIRST_SSO', showLoading: true, triggerPlayTransition: true });
        },
        [performTokenRequest]
    );

    const handleSessionReconnect = useCallback(
        async () => {
            console.log('🔄 [SESSION_RECONNECT] Starting session reconnect...');
            await performTokenRequest({ context: 'SSO_RETRY', showReconnectLoading: true });
            console.log('🔄 [SESSION_RECONNECT] Session reconnect completed');
        },
        [performTokenRequest]
    );

    // Debug logging for reconnecting state changes
    useEffect(() => {
        console.log('🔄 [DEBUG] isReconnecting state changed:', isReconnecting);
    }, [isReconnecting]);

    useEffect(() => {
        if (updateBalanceCallback) {
            SyncMemberSiteBalance.getInstance().setSyncBalanceCallback(updateBalanceCallback);
        }
    }, [updateBalanceCallback]);

    useEffect(() => {
        if (onRequestSSOToken) {
            TokenRequestManager.getInstance().setTokenRequestCallback(() => onRequestSSOToken('FIRST_SSO'));
        }
    }, [onRequestSSOToken]);

    // Initialize simulators on mount
    useEffect(() => {
        if (enableSimulators) {
            console.log('🔗 [SIMULATOR] Initializing connection management simulator');
            console.log('🔐 [SIMULATOR] Initializing SSO simulator');

            // You can set up initial simulation state here
            // connectionSimulator.simulateLoadLevel('normal');
        }
    }, [enableSimulators, connectionSimulator]);

    loadI18n(language);

    // Show RNG Soccer prototype first, then main app after play button click
    if (!hasClickedPlay) {
        return (
            <ConnectionControlSimulatorWrapper showToggleButton={enableSimulators}>
                <div data-react="true" style={{ width: '100%' }}>
                    <RNGSoccerStaticPrototype onPlayButtonClick={handlePlayButtonClick} isLoading={isLoading} />
                </div>
            </ConnectionControlSimulatorWrapper>
        );
    }

    return (
        <ConnectionControlSimulatorWrapper showToggleButton={enableSimulators}>
            <div data-react="true" style={{ width: '100%' }}>
                {currentToken && (
                    <Lobby
                        token={currentToken}
                        language={language}
                        onSSORetry={handleSessionReconnect}
                        isReconnecting={isReconnecting}
                    />
                )}
            </div>
        </ConnectionControlSimulatorWrapper>
    );
};

export default AppWithSimulator; 