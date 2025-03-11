import { useState, useEffect } from 'react';

interface ScaleConfig {
    baseWidth: number;
    baseHeight: number;
    minScale: number;
    maxScale: number;
}

export const useAnimationScale = (
    containerRef: React.RefObject<HTMLDivElement>,
    config: ScaleConfig = {
        baseWidth: 800, // Base width the animation was designed for
        baseHeight: 600, // Base height the animation was designed for
        minScale: 1,
        maxScale: 3
    }
) => {
    const [scale, setScale] = useState(2.5); // Default scale from original styles

    useEffect(() => {
        const calculateScale = () => {
            if (!containerRef.current) return;

            const container = containerRef.current;
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            // Calculate scale based on both width and height constraints
            const widthScale = containerWidth / config.baseWidth;
            const heightScale = containerHeight / config.baseHeight;

            // Use the smaller scale to ensure animation fits both dimensions
            let newScale = Math.min(widthScale, heightScale) * 2; // Multiply by 2 to maintain similar size to original

            // Clamp scale between min and max values
            newScale = Math.max(config.minScale, Math.min(config.maxScale, newScale));

            setScale(newScale);
        };

        // Initial calculation
        calculateScale();

        // Add resize listener
        window.addEventListener('resize', calculateScale);

        // Cleanup
        return () => window.removeEventListener('resize', calculateScale);
    }, [containerRef, config]);

    return scale;
}; 