import React from 'react';
import CountDownTimer, { ICountDownTimerProps } from './index';

/**
 * GameCountDownTimer - Enhanced countdown timer with customizable layout
 * This is now just an alias for CountDownTimer with useGameLayout=true for backward compatibility
 */
export interface IGameCountDownTimerProps extends Omit<ICountDownTimerProps, 'useGameLayout'> {
    language: string;
}

/**
 * Enhanced countdown timer with game-specific styling
 */
const GameCountDownTimer: React.FC<IGameCountDownTimerProps> = (props) => (
    <CountDownTimer {...props} />
);

export default GameCountDownTimer; 