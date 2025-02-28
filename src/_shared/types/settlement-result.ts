export type OverUnderSettlementResult = {
    over: boolean;
    under: boolean;
};

export type OddEvenSettlementResult = {
    odd: boolean;
    even: boolean;
};

export type BigSmallSettlementResult = {
    big: boolean;
    small: boolean;
};

export const choices = { over: "over", under: "under", odd: "odd", even: "even", big: "big", small: "small" };
