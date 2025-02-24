import React, { useState, useEffect, useRef } from 'react';
import { CardDisplay } from '../../../games/saba-club/baccarat/settlement-result/components/card-display';
import { DEMO_RESULTS } from './constants';
import { useAnimationScale } from '../../../_shared/hooks/useAnimationScale';
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

interface ScenarioType {
    label: string;
    description: string;
    category: 'natural' | 'three_cards' | 'pairs';
    winner?: 'player' | 'banker' | 'tie';
}

const SCENARIOS: ScenarioType[] = [
    {
        label: 'Natural 9 vs 8',
        description: 'Natural hands: Player (9) vs Banker (8)',
        category: 'natural',
        winner: 'player'
    },
    {
        label: 'Banker 3 Cards vs Player 2',
        description: 'Banker draws third card (2,3,4) vs Player (5,3)',
        category: 'three_cards',
        winner: 'banker'
    },
    {
        label: 'Player 3 Cards vs Banker 2',
        description: 'Player draws third card (1,2,6) vs Banker (2,3)',
        category: 'three_cards',
        winner: 'player'
    },
    {
        label: 'Both 3 Cards - Player Wins',
        description: 'Both draw third card, Player (1,2,5) vs Banker (2,1,3)',
        category: 'three_cards',
        winner: 'player'
    },
    {
        label: 'Both 3 Cards - Banker Wins',
        description: 'Both draw third card, Banker (3,2,4) vs Player (2,3,3)',
        category: 'three_cards',
        winner: 'banker'
    },
    {
        label: 'Both 3 Cards - Tie',
        description: 'Both draw third card to tie, both hands total 8',
        category: 'three_cards',
        winner: 'tie'
    },
    {
        label: 'Natural 8 vs Third Card',
        description: 'Banker Natural 8 vs Player draws third card',
        category: 'natural',
        winner: 'banker'
    },
    {
        label: 'Banker Pair with 3 Cards',
        description: 'Banker has pair of 7s and draws third card',
        category: 'pairs',
        winner: 'banker'
    },
    {
        label: 'Player Pair with 3 Cards',
        description: 'Player has pair of 8s and draws third card',
        category: 'pairs',
        winner: 'player'
    },
    {
        label: 'Both Pairs and 3 Cards',
        description: 'Both hands have pairs and draw third cards',
        category: 'pairs',
        winner: 'banker'
    },
    {
        label: 'Natural 9 Player vs 3 Cards',
        description: 'Player Natural 9 vs Banker draws third card',
        category: 'natural',
        winner: 'player'
    },
    {
        label: 'Natural 9 Banker vs 3 Cards',
        description: 'Banker Natural 9 vs Player draws third card',
        category: 'natural',
        winner: 'banker'
    }
];

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
        const currentScenario = SCENARIOS[currentIndex];
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
                const categoryScenarios = SCENARIOS.filter(scenario => scenario.category === category);
                const hasSelectedScenario = categoryScenarios.some((_, idx) =>
                    SCENARIOS.findIndex(s => s.category === category) + idx === currentIndex
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
                            {categoryScenarios.map((scenario, idx) => {
                                const index = SCENARIOS.findIndex(s => s.label === scenario.label);
                                return (
                                    <label
                                        key={scenario.label}
                                        className={`${styles.radioLabel} ${currentIndex === index ? styles.selected : ''
                                            } ${getWinnerColor(scenario.winner)}`}
                                        title={scenario.description}
                                    >
                                        <input
                                            type="radio"
                                            name="demoScenario"
                                            value={index}
                                            checked={currentIndex === index}
                                            onChange={() => onChange(index)}
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
            console.log(`Current index is set to: ${newIndex}`);

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

            <div className={`${styles.contentWrapper} ${isRawDataCollapsed || isRawDataHidden ? styles.collapsed : ''}`}>
                <DemoSelector
                    currentIndex={currentIndex}
                    onChange={handleScenarioChange}
                    disabled={isTransitioning}
                />

                <div className={styles.demoContent} ref={contentRef}>
                    <div style={{ transform: `scale(${scale})` }}>
                        <div>
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