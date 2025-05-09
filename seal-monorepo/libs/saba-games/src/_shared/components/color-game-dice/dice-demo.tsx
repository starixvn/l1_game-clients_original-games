import React, { useState } from 'react';
import AnimatedDice, { AnimatedDiceSet } from './animated-dice';
import { ColorGameSymbol, diceValueToSymbol } from './index';
import { Size } from '../../constants';
import styles from './dice-demo.module.scss';

const DiceDemo: React.FC = () => {
    const [isRolling, setIsRolling] = useState(false);
    const [finalSymbol, setFinalSymbol] = useState<ColorGameSymbol>(ColorGameSymbol.EMPTY);
    const [finalSymbols, setFinalSymbols] = useState<ColorGameSymbol[]>([]);

    const getRandomSymbol = (): ColorGameSymbol => {
        const randomValue = Math.floor(Math.random() * 6) + 1;
        return diceValueToSymbol(randomValue);
    };

    const handleSingleDiceRoll = () => {
        if (isRolling) return;
        setIsRolling(true);
        setFinalSymbol(getRandomSymbol());
    };

    const handleMultipleDiceRoll = () => {
        if (isRolling) return;
        setIsRolling(true);
        setFinalSymbols([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
    };

    const handleAnimationComplete = () => {
        setIsRolling(false);
    };

    return (
        <div className={styles.demoContainer}>
            <h1>3D Dice Animation Demo</h1>

            <section className={styles.demoSection}>
                <h2>Single Dice - Different Sizes</h2>
                <div className={styles.diceRow}>
                    <div className={styles.diceDemo}>
                        <h3>X-Large</h3>
                        <AnimatedDice
                            finalSymbol={finalSymbol}
                            size={Size.xLarge}
                            onAnimationComplete={handleAnimationComplete}
                        />
                    </div>
                    <div className={styles.diceDemo}>
                        <h3>Large</h3>
                        <AnimatedDice
                            finalSymbol={finalSymbol}
                            size={Size.large}
                            onAnimationComplete={handleAnimationComplete}
                        />
                    </div>
                    <div className={styles.diceDemo}>
                        <h3>Medium</h3>
                        <AnimatedDice
                            finalSymbol={finalSymbol}
                            size={Size.medium}
                            onAnimationComplete={handleAnimationComplete}
                        />
                    </div>
                    <div className={styles.diceDemo}>
                        <h3>Small</h3>
                        <AnimatedDice
                            finalSymbol={finalSymbol}
                            size={Size.small}
                            onAnimationComplete={handleAnimationComplete}
                        />
                    </div>
                </div>
                <button
                    className={styles.rollButton}
                    onClick={handleSingleDiceRoll}
                    disabled={isRolling}
                >
                    Roll Single Dice
                </button>
            </section>

            <section className={styles.demoSection}>
                <h2>Multiple Dice Set</h2>
                <div className={styles.diceSetDemo}>
                    <AnimatedDiceSet
                        finalSymbols={finalSymbols}
                        size={Size.large}
                        onAllAnimationsComplete={handleAnimationComplete}
                        staggerDelay={100}
                        finalRollSequenceDelay={200}
                    />
                </div>
                <button
                    className={styles.rollButton}
                    onClick={handleMultipleDiceRoll}
                    disabled={isRolling}
                >
                    Roll Multiple Dice
                </button>
            </section>

            <section className={styles.demoSection}>
                <h2>Animation Controls</h2>
                <div className={styles.controls}>
                    <div className={styles.controlGroup}>
                        <label>Animation Duration (ms):</label>
                        <input
                            type="range"
                            min="1000"
                            max="5000"
                            step="500"
                            defaultValue="3000"
                            onChange={(e) => {
                                // You can add animation duration control here
                            }}
                        />
                    </div>
                    <div className={styles.controlGroup}>
                        <label>Stagger Delay (ms):</label>
                        <input
                            type="range"
                            min="0"
                            max="500"
                            step="50"
                            defaultValue="100"
                            onChange={(e) => {
                                // You can add stagger delay control here
                            }}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DiceDemo; 