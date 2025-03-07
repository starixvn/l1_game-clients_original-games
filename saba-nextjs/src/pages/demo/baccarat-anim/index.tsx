import React, { useState, useEffect, useRef } from 'react';
import { CardDisplay } from '../../../games/saba-club/baccarat/settlement-result/components/card-display';
import { TEXTS, BACCARAT_SCENARIOS } from '../../../games/saba-club/baccarat/baccarat-anim/constants';
import { useAnimationScale } from '../../../_shared/hooks/useAnimationScale';
import styles from './styles.module.scss';

// Chevron icon component
const ChevronIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 6 15 12 9 18"></polyline>
    </svg>
);

// Quick Guide component
const QuickGuide: React.FC = () => (
    <div className={styles.quickGuide}>
        <div className={styles.guideItem}>
            <span>📋</span> Select from Natural, Three Card, or Pairs scenarios on the right
        </div>
        <div className={styles.guideItem}>
            <span>🎴</span> Watch cards being dealt
        </div>
    </div>
);

const DemoSelector: React.FC<{
    currentIndex: number;
    onChange: (index: number) => void;
    disabled: boolean;
}> = ({ currentIndex, onChange, disabled }) => {
    const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

    const categories = {
        natural: 'Natural Hands',
        three_cards: 'Three Card Hands',
        pairs: 'Pairs'
    };

    const getWinnerColor = (winner?: string) => {
        switch (winner) {
            case 'player': return styles.playerWin;
            case 'banker': return styles.bankerWin;
            case 'tie': return styles.tieGame;
            default: return '';
        }
    };

    const toggleCategory = (category: string) => {
        setCollapsedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    // Find if current selection is in a category
    const getCurrentCategory = () => {
        const currentScenario = BACCARAT_SCENARIOS[currentIndex];
        return currentScenario?.category;
    };

    // Automatically expand category with current selection
    useEffect(() => {
        const currentCategory = getCurrentCategory();
        if (currentCategory && collapsedCategories[currentCategory]) {
            setCollapsedCategories(prev => ({
                ...prev,
                [currentCategory]: false
            }));
        }
    }, [currentIndex]);

    return (
        <div className={styles.demoSelector}>
            <h3>Select Demo Scenario:</h3>
            {Object.entries(categories).map(([category, title]) => {
                const isCollapsed = collapsedCategories[category];
                const categoryScenarios = BACCARAT_SCENARIOS.filter(scenario =>
                    scenario.category === category && scenario.visible !== false
                );
                const hasSelectedScenario = categoryScenarios.some((_, idx) =>
                    BACCARAT_SCENARIOS.filter(s => s.visible !== false).findIndex(s => s.category === category) + idx === currentIndex
                );

                return (
                    <div key={category} className={styles.categoryGroup}>
                        <div
                            className={`${styles.categoryHeader} ${hasSelectedScenario ? styles.hasSelected : ''}`}
                            onClick={() => toggleCategory(category)}
                        >
                            <div className={`${styles.collapseIcon} ${isCollapsed ? styles.collapsed : ''}`}>
                                <ChevronIcon />
                            </div>
                            <h4 className={styles.categoryTitle}>
                                {title}
                                <span className={styles.scenarioCount}>
                                    ({categoryScenarios.length})
                                </span>
                            </h4>
                        </div>
                        <div className={`${styles.radioGroup} ${isCollapsed ? styles.collapsed : ''}`}>
                            {categoryScenarios.map((scenario) => {
                                const scenarioIndex = BACCARAT_SCENARIOS.filter(s => s.visible !== false)
                                    .findIndex(s => s.label === scenario.label);
                                return (
                                    <label
                                        key={scenario.label}
                                        className={`${styles.radioLabel} ${currentIndex === scenarioIndex ? styles.selected : ''
                                            } ${getWinnerColor(scenario.winner)}`}
                                        title={scenario.description}
                                    >
                                        <input
                                            type="radio"
                                            name="demoScenario"
                                            value={scenarioIndex}
                                            checked={currentIndex === scenarioIndex}
                                            onChange={() => onChange(scenarioIndex)}
                                            disabled={disabled}
                                            className={styles.radioInput}
                                            aria-label={scenario.label}
                                            aria-description={scenario.description}
                                        />
                                        <div className={styles.radioContent}>
                                            <span className={styles.radioText}>{scenario.label}</span>
                                            <span className={styles.radioDescription}>
                                                {scenario.description}
                                            </span>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const BaccaratAnimationDemo: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimationResult, setIsAnimationResult] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isShowResult, setIsShowResult] = useState(true);
    const [isDocked, setIsDocked] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (headerRef.current) {
                const headerRect = headerRef.current.getBoundingClientRect();
                const shouldDock = headerRect.top <= 0;
                setIsDocked(shouldDock);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial position

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScenarioChange = (newIndex: number) => {
        if (isTransitioning || currentIndex === newIndex) return;
        setIsTransitioning(true);

        // First hide all animations and results
        setIsShowResult(false);
        setIsAnimationResult(false);

        // Wait for current animation to fully clear
        setTimeout(() => {
            // Update to selected demo index
            setCurrentIndex(newIndex);

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

    const contentRef = useRef<HTMLDivElement>(null);
    const scale = useAnimationScale(contentRef);

    return (
        <div className={styles.demoContainer}>
            <div ref={headerRef} className={`${styles.headerSection} ${isDocked ? styles.docked : ''}`}>
                <h1 className={styles.demoTitle}>Baccarat Animation Demo</h1>
                <QuickGuide />
            </div>

            <div className={styles.contentWrapper}>
                <DemoSelector
                    currentIndex={currentIndex}
                    onChange={handleScenarioChange}
                    disabled={isTransitioning}
                />

                <div className={styles.demoContent} ref={contentRef}>
                    <div style={{ transform: `scale(${scale})` }}>
                        <div>
                            <CardDisplay
                                result={BACCARAT_SCENARIOS[currentIndex]}
                                isAnimationResult={isAnimationResult}
                                isShowResult={isShowResult}
                                texts={TEXTS}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BaccaratAnimationDemo;