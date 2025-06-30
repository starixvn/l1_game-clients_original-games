import { useSSOSimulator } from '../_shared/components/sso-control-simulator';

export type TokenRequestContext = 'FIRST_SSO' | 'SSO_RETRY';

export interface PrototypeState {
    playButtonClickCount: number;
    setPlayButtonClickCount: React.Dispatch<React.SetStateAction<number>>;
}

export interface PreviewContextProps {
    onRequestSSOToken: (context: TokenRequestContext) => Promise<string | null>;
    playButtonClickCount: number;
    setPlayButtonClickCount: React.Dispatch<React.SetStateAction<number>>;
    currentScenarioKey: string;
    setCurrentScenarioKey: React.Dispatch<React.SetStateAction<string>>;
    ssoSimulator: ReturnType<typeof useSSOSimulator>;
}

export interface ScenarioResetWrapperProps {
    scenarioKey: string;
    children: (key: string) => React.ReactNode;
}

export interface SSOFailureModeLogicProps {
    showSSOControls: boolean;
    ssoSimulator: ReturnType<typeof useSSOSimulator>;
    playButtonClickCount: number;
}

export interface TokenRequestHookParams {
    playButtonClickCount: number;
    setPlayButtonClickCount: React.Dispatch<React.SetStateAction<number>>;
    failCount: number;
    isFailureMode: boolean;
}

export interface AppConfiguration {
    theme: string;
    isDarkMode: boolean;
    language: string;
    showSSOControls: boolean;
    appEnv: string;
    siteId: string;
    platform: string;
}

// Connection Management Simulator Types
export type ConnectionLoadLevel = 'low' | 'normal' | 'high' | 'overloaded' | 'critical';

export interface ConnectionSimulatorState {
    showControls: boolean;
    isSimulationActive: boolean;
    currentLoadLevel: ConnectionLoadLevel;
    simulatedConnections: number;
    maxConnections: number;
    inactivityTimeout: number;
    pollingModeEnabled: boolean;
    connectionQueueLength: number;
    failureRate: number;
    responseTimeDelay: number;
}

export interface ConnectionScenario {
    id: string;
    name: string;
    description: string;
    loadLevel: ConnectionLoadLevel;
    settings: Partial<ConnectionSimulatorState>;
}

export interface ConnectionMetrics {
    totalConnections: number;
    activeConnections: number;
    failedConnections: number;
    averageResponseTime: number;
    healthStatus: 'healthy' | 'degraded' | 'overloaded';
    connectionRatio: number;
    failureRate: number;
}

export interface ConnectionSimulatorProps {
    showControls: boolean;
    isSimulationActive: boolean;
    currentLoadLevel: ConnectionLoadLevel;
    onToggleSimulation: () => void;
    onToggleControls: () => void;
    onLoadLevelChange: (level: ConnectionLoadLevel) => void;
    onScenarioSelect: (scenario: ConnectionScenario) => void;
    metrics: ConnectionMetrics;
    recommendations: string[];
} 