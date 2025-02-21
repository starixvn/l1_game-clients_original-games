import React, { useState, useEffect, useRef } from 'react';
import { CardDisplay } from '../../../games/saba-club/baccarat/settlement-result/components/card-display';
import { DEMO_RESULTS } from './constants';
import { useAnimationScale } from './hooks/useAnimationScale';
import { TEXTS } from './constants';
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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimationResult, setIsAnimationResult] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isShowResult, setIsShowResult] = useState(true);

    const nextDemo = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);

        // First hide all animations and results
        setIsShowResult(false);
        setIsAnimationResult(false);

        // Wait for current animation to fully clear
        setTimeout(() => {
            // Update to next demo index
            setCurrentIndex(prev => {
                const newIndex = (prev + 1) % DEMO_RESULTS.length;
                console.log(`Current index is set to: ${newIndex}`);
                return newIndex;
            });

            // Wait for DOM update with new index
            requestAnimationFrame(() => {
                // Show cards without animation first
                setIsShowResult(true);

                // Start new animation sequence after a brief delay
                setTimeout(() => {
                    setIsAnimationResult(true);
                    setIsTransitioning(false);
                }, 300);
            });
        }, 500);
    };

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

            <div className={styles.controls}>
                <button
                    onClick={nextDemo}
                    className={`${styles.button} ${isTransitioning ? styles.disabled : ''}`}
                    disabled={isTransitioning}
                >
                    Next Demo
                </button>
            </div>

            <div className={`${styles.contentWrapper} ${isRawDataCollapsed || isRawDataHidden ? styles.collapsed : ''}`}>
                <div className={styles.demoContent} ref={contentRef}>
                    <div
                        style={{ transform: `scale(${scale})` }}
                    >
                        <div >
                            <CardDisplay
                                result={DEMO_RESULTS[currentIndex]}
                                isAnimationResult={isAnimationResult}
                                isShowResult={isShowResult}
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