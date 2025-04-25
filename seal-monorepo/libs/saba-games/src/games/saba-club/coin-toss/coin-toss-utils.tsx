import { CoinSymbol } from "../../../_shared/components/coin";

export const resultMapper = {
    empty: -1,
    head: 0,
    tail: 1,
};

export const convertValueToSymbol = (value: number): CoinSymbol => {
    switch (value) {
        case resultMapper.head: return CoinSymbol.HEAD;
        case resultMapper.tail: return CoinSymbol.TAIL;
        default: return CoinSymbol.EMPTY;
    }
};
