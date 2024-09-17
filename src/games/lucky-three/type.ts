export const LuckyNextChoices = {
    over: "over",
    under: "under",
    odd: "odd",
    even: "even"
};

export const mainChoices = [LuckyNextChoices.odd, LuckyNextChoices.even, LuckyNextChoices.over, LuckyNextChoices.under];


export type NextBallSettlementResult = {
    over: boolean;
    under: boolean;
    odd: boolean;
    even: boolean;
    drawId: number;
};

export type NextBallResult = {
    ball: number;
    drawId: number;
    time: string;
};

export type Odd = {};
