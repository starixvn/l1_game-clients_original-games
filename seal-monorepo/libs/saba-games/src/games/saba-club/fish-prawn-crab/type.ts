export enum FishPrawnCrabChoices {
    fish = 'fish',
    prawn = 'prawn',
    crab = 'crab',
    rooster = 'rooster',
    gourd = 'gourd',
    coin = 'coin'
}

export type FishPrawnCrabSymbol = keyof typeof FishPrawnCrabChoices;

export const mainChoices = [
    FishPrawnCrabChoices.fish,
    FishPrawnCrabChoices.prawn,
    FishPrawnCrabChoices.crab
];

export const topChoices = [
    FishPrawnCrabChoices.rooster,
    FishPrawnCrabChoices.gourd
];

export const bottomChoices = [
    FishPrawnCrabChoices.coin
];

export type FishPrawnCrabResult = {
    [key in FishPrawnCrabSymbol]?: boolean;
};

export type FishPrawnCrabSettlementResult = {
    [key in FishPrawnCrabChoices]?: boolean;
};

// Map choices to their display icons/patterns
export const ChoiceFishPrawnCrabIconMapper: { [key: string]: boolean[] } = {
    [FishPrawnCrabChoices.fish]: [true, false, true],
    [FishPrawnCrabChoices.prawn]: [false, true, false],
    [FishPrawnCrabChoices.crab]: [true, true, true],
    [FishPrawnCrabChoices.rooster]: [true, false, false],
    [FishPrawnCrabChoices.gourd]: [false, true, true],
    [FishPrawnCrabChoices.coin]: [false, false, true]
};

export interface FishPrawnCrabBet {
    symbol: FishPrawnCrabSymbol;
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