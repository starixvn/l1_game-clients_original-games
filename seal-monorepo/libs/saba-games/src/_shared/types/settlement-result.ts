export type OverUnderSettlementResult = {
    over: boolean | undefined;
    under: boolean | undefined;
};

export type OddEvenSettlementResult = {
    odd: boolean;
    even: boolean;
};

export const choices = { over: 'over', under: 'under', odd: 'odd', even: 'even' };
