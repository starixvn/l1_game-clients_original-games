export const LuckyNextChoices = {
    over: "over",
    odd: "odd",
    under: "under",
    even: "even",
};

export const mainChoices = [LuckyNextChoices.odd, LuckyNextChoices.even, LuckyNextChoices.over, LuckyNextChoices.under];

export type LuckyNextSettlementResult = {
    over: boolean;
    under: boolean;
    odd: boolean;
    even: boolean;
};

export type LuckyNextSettlementDrawResult = LuckyNextSettlementResult & {
    drawId: number;
};

export type LuckyNextResult = {
    ball: number;
    drawId: number;
    time: string;
};

export type Odd = {};
