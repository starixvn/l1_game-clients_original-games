import React, { useState, useEffect, useRef } from 'react';
import { CardDisplay } from '../../../games/saba-club/baccarat/settlement-result/components/card-display';
import { DEMO_RESULTS } from './constants';
import { DemoControls } from './components/DemoControls';
import { useAutoSwitch } from './hooks/useAutoSwitch';
import { useAnimationScale } from './hooks/useAnimationScale';
import { AUTO_SWITCH_INTERVAL, TEXTS } from './constants';
import styles from './styles.module.scss';

// Chevron icon component
const ChevronIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 6 15 12 9 18"></polyline>
    </svg>
);

// Raw Result Data component
const RawResultData: React.FC<{
    result: any;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    isHidden: boolean;
}> = ({ result, isCollapsed, onToggleCollapse, isHidden }) => {
    if (isHidden) return null;

    return (
        <div className={`${styles.rawDataContainer} ${isCollapsed ? styles.collapsed : ''}`}>
            <div className={styles.rawDataHeader} onClick={onToggleCollapse}>
                <h3 className={styles.rawDataTitle}>
                    Raw Result Data
                    <div className={styles.collapseIcon}>
                        <ChevronIcon />
                    </div>
                </h3>
            </div>
            <pre className={styles.rawDataContent}>
                {JSON.stringify(result, null, 2)}
            </pre>
        </div>
    );
};

const BaccaratAnimationDemo: React.FC = () => {
    const [
        { isEnabled, isResultVisible, currentIndex, isAnimationResult, isTransitioning },
        { toggleAutoSwitch, toggleResult, nextDemo }
    ] = useAutoSwitch(AUTO_SWITCH_INTERVAL, DEMO_RESULTS.length);

    const [isRawDataCollapsed, setIsRawDataCollapsed] = useState(true);
    const [isRawDataHidden, setIsRawDataHidden] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);
    const scale = useAnimationScale(contentRef);

    const handleToggleCollapse = () => {
        setIsRawDataCollapsed(prev => !prev);
    };

    // Add keyboard shortcut to toggle raw data visibility
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            // Toggle raw data section with Alt + R
            if (event.altKey && event.key.toLowerCase() === 'r') {
                setIsRawDataHidden(prev => !prev);
                setIsRawDataCollapsed(false); // Expand when showing
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    return (
        <div className={styles.demoContainer}>
            <h1 className={styles.demoTitle}>Baccarat Animation Demo</h1>

            <DemoControls
                isAutoSwitchEnabled={isEnabled}
                isResultVisible={isResultVisible}
                onToggleResult={toggleResult}
                onNextDemo={nextDemo}
                onToggleAutoSwitch={toggleAutoSwitch}
                isTransitioning={isTransitioning}
            />

            <div className={`${styles.contentWrapper} ${isRawDataCollapsed || isRawDataHidden ? styles.collapsed : ''}`}>
                <div className={styles.demoContent} ref={contentRef}>
                    <div
                        className={`animation-container ${isTransitioning ? 'fade-out' : 'fade-in'}`}
                        style={{ transform: `scale(${scale})` }}
                    >
                        <div className={`result-transition ${isTransitioning ? 'slide-out' : 'slide-in'}`}>
                            <CardDisplay
                                result={DEMO_RESULTS[currentIndex]}
                                isAnimationResult={isAnimationResult}
                                isShowResult={isResultVisible}
                                texts={TEXTS}
                            />
                        </div>
                    </div>
                </div>

                <RawResultData
                    result={DEMO_RESULTS[currentIndex]}
                    isCollapsed={isRawDataCollapsed}
                    onToggleCollapse={handleToggleCollapse}
                    isHidden={isRawDataHidden}
                />
            </div>
        </div>
    );
};

export default BaccaratAnimationDemo; 