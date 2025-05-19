export enum RNGSoccerChoices {
    home = 'home',
    away = 'away',
    draw = 'draw'
}

export type RNGSoccerSymbolType = keyof typeof RNGSoccerChoices;

export interface RNGSoccerResult {
    homeScore: number;
    awayScore: number;
    homeCard: {
        card: number;
        type: number;
    };
    awayCard: {
        card: number;
        type: number;
    };
}

export interface RNGSoccerSettlementResult {
    result: RNGSoccerResult;
    roundId: number;
    roundState: string;
}

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