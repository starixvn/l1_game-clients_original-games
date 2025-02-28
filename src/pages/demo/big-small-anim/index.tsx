import React, { useCallback, useState, useMemo } from "react";
import DiceV2 from "./dice-v2";
import DiceV1 from "./dice-v1";
import styles from "./styles.module.scss";
import { calculateTotalDiceNumber, getRandomDiceNumbers } from "../../../_shared/utils/number-helper";

const animationVersion = {
    v1: 'v1',
    v2: 'v2'
};

type DiceControlsProps = {
    rollDice: () => void;
    resetDice: () => void;
    rolling: boolean;
};

const DiceControls: React.FC<DiceControlsProps> = ({ rollDice, resetDice, rolling }) => (
    <div className={styles.buttons}>
        <button
            className={styles.roll}
            onClick={rollDice}
            disabled={rolling}
            aria-label="Roll Dice"
        >
            Roll Dice
        </button>
        <button
            className={styles.roll}
            onClick={resetDice}
            aria-label="Reset Placing Bet"
        >
            Reset
        </button>
    </div>
);

type AnimationVersionTabsProps = {
    selectedAnimation: string;
    setSelectedAnimation: (version: string) => void;
    animationVersions: typeof animationVersion;
};

const AnimationVersionTabs: React.FC<AnimationVersionTabsProps> = ({ selectedAnimation, setSelectedAnimation, animationVersions }) => (
    <div className={styles.tabs}>
        {Object.values(animationVersions).map((version) => (
            <button
                key={version}
                className={selectedAnimation === version ? styles.activeTab : ''}
                onClick={() => setSelectedAnimation(version)}
            >
                Animation {version.toUpperCase()}
            </button>
        ))}
    </div>
);

const BigSmallAnimDemo: React.FC = () => {
    const [rolling, setRolling] = useState(false);
    const [diceNumbers, setDiceNumbers] = useState([0, 0, 0]);
    const [selectedAnimation, setSelectedAnimation] = useState(animationVersion.v1);
    const [totalDiceNumber, setTotalDiceNumber] = useState(0);

    const rollDice = useCallback(() => {
        if (rolling) return;
        setRolling(true);

        const intervalId = setInterval(() => {
            setDiceNumbers(getRandomDiceNumbers());
        }, 80);

        setTimeout(() => {
            clearInterval(intervalId);
            const newDiceNumbers = getRandomDiceNumbers();
            setDiceNumbers(newDiceNumbers);
            setTotalDiceNumber(calculateTotalDiceNumber(newDiceNumbers));
            setRolling(false);
        }, 1000);
    }, [rolling]);

    const resetDice = useCallback(() => {
        setDiceNumbers([0, 0, 0]);
        setTotalDiceNumber(0);
    }, []);

    const renderDice = useMemo(() => (
        diceNumbers.map((number, index) => (
            selectedAnimation === animationVersion.v1 ? (
                <DiceV1 key={index} diceNumber={number} rolling={rolling} />
            ) : (
                <DiceV2 key={index} diceNumber={number} rolling={rolling} />
            )
        ))
    ), [diceNumbers, rolling, selectedAnimation]);

    return (
        <div className={styles.container}>
            <AnimationVersionTabs 
                selectedAnimation={selectedAnimation} 
                setSelectedAnimation={setSelectedAnimation} 
                animationVersions={animationVersion} 
            />
            <div className={styles.diceContainer}>
                {renderDice}
                <div className={styles.diceResult}>{totalDiceNumber}</div>
            </div>
            <DiceControls rollDice={rollDice} resetDice={resetDice} rolling={rolling} />
        </div>
    );
};

export default BigSmallAnimDemo;
