import { FishPrawnCrabSymbol } from "../../../_shared/components/fish-prawn-crab-dice";

export enum FishPrawnCrabChoices {
    fish = 'fish',
    prawn = 'prawn',
    crab = 'crab',
    rooster = 'rooster',
    gourd = 'gourd',
    stag = 'stag'
}

export type FishPrawnCrabSymbolType = keyof typeof FishPrawnCrabChoices;

export const topChoices = [
    FishPrawnCrabChoices.stag,
    FishPrawnCrabChoices.gourd,
    FishPrawnCrabChoices.prawn
];

export const bottomChoices = [
    FishPrawnCrabChoices.fish,
    FishPrawnCrabChoices.crab,
    FishPrawnCrabChoices.rooster
];

export type FishPrawnCrabResult = {
    [key in FishPrawnCrabSymbolType]?: boolean;
};

export type FishPrawnCrabSettlementResult = {
    [key in FishPrawnCrabSymbolType]?: boolean;
};

// Map choices to their display icons/patterns
export const ChoiceFishPrawnCrabIconMapper: { [key: string]: FishPrawnCrabSymbol } = {
    [FishPrawnCrabChoices.fish]: FishPrawnCrabSymbol.FISH,
    [FishPrawnCrabChoices.prawn]: FishPrawnCrabSymbol.PRAWN,
    [FishPrawnCrabChoices.crab]: FishPrawnCrabSymbol.CRAB,
    [FishPrawnCrabChoices.rooster]: FishPrawnCrabSymbol.ROOSTER,
    [FishPrawnCrabChoices.gourd]: FishPrawnCrabSymbol.GOURD,
    [FishPrawnCrabChoices.stag]: FishPrawnCrabSymbol.STAG
};

export interface FishPrawnCrabBet {
    symbol: FishPrawnCrabSymbolType;
    amount: number;
}

export interface FishPrawnCrabRound {
    roundId: string;
    status: 'placingBets' | 'lockingBet' | 'showingResult' | 'finished';
    startTime: number;
    endTime: number;
    result?: FishPrawnCrabResult;
    bets?: FishPrawnCrabBet[];
} 