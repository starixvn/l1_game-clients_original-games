export enum RNGSoccerChoices {
    home = 'home',
    away = 'away',
    draw = 'draw'
}

export type RNGSoccerSymbolType = keyof typeof RNGSoccerChoices;

export type RNGSoccerResult = {
    [key in RNGSoccerSymbolType]?: boolean;
};

export type RNGSoccerSettlementResult = {
    [key in RNGSoccerSymbolType]?: boolean;
};

export interface RNGSoccerBet {
    symbol: RNGSoccerSymbolType;
    amount: number;
}

export interface RNGSoccerRound {
    roundId: string;
    status: 'placingBets' | 'lockingBet' | 'showingResult' | 'finished';
    startTime: number;
    endTime: number;
    result?: RNGSoccerResult;
    bets?: RNGSoccerBet[];
}

export interface RNGSoccerRoundHistory {
    roundId: number;
    settlementResult: RNGSoccerSettlementResult;
    result: RNGSoccerResult;
} 