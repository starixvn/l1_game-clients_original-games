import React, { useState } from 'react';
import { useConnectionSimulator } from '../hooks/use-connection-simulator';
import ConnectionControlSimulator from './connection-control-simulator';

interface ConnectionControlSimulatorWrapperProps {
    children?: React.ReactNode;
    showToggleButton?: boolean;
    initialShowControls?: boolean;
}

export const ConnectionControlSimulatorWrapper: React.FC<ConnectionControlSimulatorWrapperProps> = ({
    children,
    showToggleButton = true,
    initialShowControls = false
}) => {
    const [showControls, setShowControls] = useState(initialShowControls);
    const connectionSimulator = useConnectionSimulator();

    const toggleControls = () => {
        setShowControls(!showControls);
    };

    return (
        <div className="relative">
            {/* Toggle Button */}
            {showToggleButton && (
                <button
                    className="fixed top-4 left-4 z-40 px-3 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                    onClick={toggleControls}
                    title="Toggle Connection Management Simulator"
                >
                    🔗 Connection Simulator
                </button>
            )}

            {/* Connection Control Simulator */}
            <ConnectionControlSimulator
                showControls={showControls}
                onToggleControls={toggleControls}
            />

            {/* Children */}
            {children}
        </div>
    );
};

export default ConnectionControlSimulatorWrapper; 