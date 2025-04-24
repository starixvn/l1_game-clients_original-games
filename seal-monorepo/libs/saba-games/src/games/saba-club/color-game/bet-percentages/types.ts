import * as gc from '@sg/sg-game-client';
import { ColorGameChoices } from '../type';

export interface BetResult {
    yellow: boolean;
    red: boolean;
    pink: boolean;
    white: boolean;
    blue: boolean;
    green: boolean;
}

export interface BetCounts {
    yellow: number;
    red: number;
    pink: number;
    white: number;
    blue: number;
    green: number;
}

export interface BetPercentagesProps {
    gameName: string;
    rounds: gc.RoundHistories.RoundHistory[];
    translator?: (key: string) => string;
    language?: string;
}

export interface BetPercentageItemProps {
    gameName: string;
    choice: ColorGameChoices;
    count: number;
    translateBetOption: (option: string) => string;
} 