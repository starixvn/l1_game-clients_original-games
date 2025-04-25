import { CoinSymbol } from "../../../_shared/components/coin";

// TODO: 待確認
export enum CoinTossOddsType {
    single = 'single',
    double = 'double',
    triple = 'triple'
}

export enum CoinTossChoices {
    head = 'head',
    tail = 'tail'
}

export type CoinTossSymbolType = keyof typeof CoinTossChoices;

export type CoinTossResult = {
    [key in CoinTossSymbolType]?: boolean;
};

export type CoinTossSettlementResult = {
    [key in CoinTossSymbolType]?: boolean;
};

// Map choices to their display icons/patterns
export const ChoiceCoinTossIconMapper: { [key: string]: CoinSymbol } = {
    [CoinTossChoices.head]: CoinSymbol.HEAD,
    [CoinTossChoices.tail]: CoinSymbol.TAIL,
};

export interface CoinTossBet {
    symbol: CoinTossSymbolType;
    amount: number;
}

export interface CoinTossRound {
    roundId: string;
    status: 'placingBets' | 'lockingBet' | 'showingResult' | 'finished';
    startTime: number;
    endTime: number;
    result?: CoinTossResult;
    bets?: CoinTossBet[];
} 

export const coinChoices = [
    CoinTossChoices.head,
    CoinTossChoices.tail
]