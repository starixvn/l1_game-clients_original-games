/**
 * SSO Controls Configuration Utility
 * 
 * Determines whether SSO controls should be shown based on environment variables
 * for testing and development purposes.
 */

interface SimulatorConfig {
    simulationMode: {
        enabled: boolean;
    };
    simulatorConfigs: {
        enabled: boolean;
        defaultGameType: string;
    };
}

/**
 * Safe environment variable access
 * Handles both Node.js and browser environments
 */
const getEnvVar = (key: string): string | undefined => {
    // Check if process is available (Node.js environment)
    if (typeof process !== 'undefined' && process.env) {
        return process.env[key];
    }

    // Browser environment - check for global variables
    if (typeof window !== 'undefined' && (window as any).__ENV__) {
        return (window as any).__ENV__[key];
    }

    return undefined;
};

/**
 * Parse SIMULATOR_CONFIG environment variable
 * @returns parsed simulator configuration or null if invalid
 */
const parseSimulatorConfig = (): SimulatorConfig | null => {
    const configString = getEnvVar('SIMULATOR_CONFIG');

    console.log('🔍 [SSO_CONTROLS_DEBUG] SIMULATOR_CONFIG raw value:', configString);
    console.log('🔍 [SSO_CONTROLS_DEBUG] NODE_ENV:', getEnvVar('NODE_ENV'));
    console.log('🔍 [SSO_CONTROLS_DEBUG] Environment type:', typeof process !== 'undefined' ? 'Node.js' : 'Browser');

    if (!configString) {
        console.log('🔍 [SSO_CONTROLS_DEBUG] No SIMULATOR_CONFIG found');
        return null;
    }

    try {
        const parsed = JSON.parse(configString) as SimulatorConfig;
        console.log('🔍 [SSO_CONTROLS_DEBUG] Parsed config:', parsed);
        return parsed;
    } catch (error) {
        console.warn('⚠️ [SSO_CONTROLS] Failed to parse SIMULATOR_CONFIG:', error);
        return null;
    }
};

/**
 * Check if SSO controls should be displayed
 * @returns boolean indicating whether SSO controls should be shown
 */
export const shouldShowSSOControls = (): boolean => {
    const nodeEnv = getEnvVar('NODE_ENV');

    console.log('🔍 [SSO_CONTROLS_DEBUG] Checking shouldShowSSOControls...');
    console.log('🔍 [SSO_CONTROLS_DEBUG] NODE_ENV:', nodeEnv);

    // In production, never show SSO controls
    if (nodeEnv === 'production') {
        console.log('🔍 [SSO_CONTROLS_DEBUG] Production environment - returning false');
        return false;
    }

    // In development, check the SIMULATOR_CONFIG
    if (nodeEnv === 'development') {
        console.log('🔍 [SSO_CONTROLS_DEBUG] Development environment - checking SIMULATOR_CONFIG');
        const config = parseSimulatorConfig();

        // If no config or invalid config, default to false
        if (!config) {
            console.log('🔍 [SSO_CONTROLS_DEBUG] No valid config found - returning false');
            return false;
        }

        // Show controls if both simulation mode and simulator configs are enabled
        const shouldShow = config.simulationMode.enabled && config.simulatorConfigs.enabled;
        console.log('🔍 [SSO_CONTROLS_DEBUG] Config check result:', {
            simulationModeEnabled: config.simulationMode.enabled,
            simulatorConfigsEnabled: config.simulatorConfigs.enabled,
            shouldShow
        });
        return shouldShow;
    }

    // For other environments (test, etc.), default to false
    console.log('🔍 [SSO_CONTROLS_DEBUG] Other environment - returning false');
    return false;
};

/**
 * Get SSO controls configuration for debugging
 * @returns object with configuration details
 */
export const getSSOControlsConfig = () => {
    const config = parseSimulatorConfig();

    return {
        showControls: shouldShowSSOControls(),
        simulatorConfig: config,
        environmentVariable: getEnvVar('SIMULATOR_CONFIG'),
        nodeEnv: getEnvVar('NODE_ENV'),
        isDevelopment: getEnvVar('NODE_ENV') === 'development',
        isProduction: getEnvVar('NODE_ENV') === 'production',
        isTest: getEnvVar('NODE_ENV') === 'test'
    };
};

/**
 * Log SSO controls configuration for debugging
 */
export const logSSOControlsConfig = () => {
    const config = getSSOControlsConfig();
    console.log('🔧 [SSO_CONTROLS] Configuration:', config);

    if (config.showControls) {
        console.log('🟢 [SSO_CONTROLS] SSO controls are ENABLED for testing');
        console.log('💡 [SSO_CONTROLS] Use "npm run start-hot-league:no-sso-controls" to disable');
    } else {
        console.log('🔴 [SSO_CONTROLS] SSO controls are DISABLED');
        if (config.isDevelopment) {
            console.log('💡 [SSO_CONTROLS] Use "npm run start-hot-league:with-sso-controls" to enable');
        }
    }
};

/**
 * Force enable SSO controls for testing (development only)
 * This is a fallback mechanism in case environment variables don't work
 * Only use this if no SIMULATOR_CONFIG is provided
 */
export const forceEnableSSOControls = (): boolean => {
    if (getEnvVar('NODE_ENV') === 'development') {
        // Only force enable if no SIMULATOR_CONFIG is provided
        if (!getEnvVar('SIMULATOR_CONFIG')) {
            console.log('🟡 [SSO_CONTROLS] Force enabling SSO controls for development testing (no SIMULATOR_CONFIG provided)');
            return true;
        }
        console.log('🟡 [SSO_CONTROLS] SIMULATOR_CONFIG provided, not using force enable');
        return false;
    }
    return false;
}; 