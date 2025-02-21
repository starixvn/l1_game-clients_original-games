import { useState, useEffect } from 'react';

interface AutoSwitchState {
    isEnabled: boolean;
    isResultVisible: boolean;
    currentIndex: number;
    isAnimationResult: boolean;
    isTransitioning: boolean;
}

interface AutoSwitchActions {
    toggleAutoSwitch: () => void;
    toggleResult: () => void;
    nextDemo: () => void;
}

export const useAutoSwitch = (
    interval: number,
    maxIndex: number
): [AutoSwitchState, AutoSwitchActions] => {
    const [isEnabled, setIsEnabled] = useState(true);
    const [isResultVisible, setIsResultVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimationResult, setIsAnimationResult] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const toggleAutoSwitch = () => setIsEnabled(prev => !prev);

    const toggleResult = () => {
        if (isEnabled || isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setIsResultVisible(prev => !prev);
            setIsTransitioning(false);
        }, 300); // Match the CSS transition duration
    };

    const nextDemo = () => {
        if (isEnabled || isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(prev => (prev + 1) % maxIndex);
            setIsAnimationResult(true);
            setIsTransitioning(false);
        }, 300); // Match the CSS transition duration
    };

    // Main auto-switch timer
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (isEnabled && !isTransitioning) {
            timer = setInterval(() => {
                setIsTransitioning(true);
                setTimeout(() => {
                    setIsResultVisible(prev => !prev);
                    if (!isResultVisible) {
                        setCurrentIndex(prev => (prev + 1) % maxIndex);
                        setIsAnimationResult(true);
                    }
                    setIsTransitioning(false);
                }, 300);
            }, interval);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [isEnabled, isResultVisible, interval, maxIndex, isTransitioning]);

    // Ensure the demo starts immediately
    useEffect(() => {
        setIsResultVisible(true);
    }, []);

    return [
        { isEnabled, isResultVisible, currentIndex, isAnimationResult, isTransitioning },
        { toggleAutoSwitch, toggleResult, nextDemo }
    ];
}; 