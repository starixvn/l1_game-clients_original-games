import React from 'react';
import styles from '../styles.module.scss';

interface DemoControlsProps {
    isAutoSwitchEnabled: boolean;
    isResultVisible: boolean;
    isTransitioning: boolean;
    onToggleResult: () => void;
    onNextDemo: () => void;
    onToggleAutoSwitch: () => void;
}

export const DemoControls: React.FC<DemoControlsProps> = ({
    isAutoSwitchEnabled,
    isResultVisible,
    isTransitioning,
    onToggleResult,
    onNextDemo,
    onToggleAutoSwitch
}) => {
    return (
        <div className={styles.controls}>
            <button
                onClick={onToggleResult}
                className={`${isAutoSwitchEnabled || isTransitioning ? styles.disabled : ''}`}
                disabled={isAutoSwitchEnabled || isTransitioning}
            >
                {isResultVisible ? 'Hide Result' : 'Show Result'}
            </button>
            <button
                onClick={onNextDemo}
                className={`${isAutoSwitchEnabled || isTransitioning ? styles.disabled : ''}`}
                disabled={isAutoSwitchEnabled || isTransitioning}
            >
                Next Demo
            </button>
            <button
                onClick={onToggleAutoSwitch}
                className={`${isAutoSwitchEnabled ? styles.active : ''} ${isTransitioning ? styles.disabled : ''}`}
                disabled={isTransitioning}
            >
                {isAutoSwitchEnabled ? 'Auto Switch Running' : 'Start Auto Switch'}
            </button>
        </div>
    );
}; 