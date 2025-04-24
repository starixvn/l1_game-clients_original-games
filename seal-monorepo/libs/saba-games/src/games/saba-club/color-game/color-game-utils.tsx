import { ColorGameSymbol } from "../../../_shared/components/color-game-dice";

export const resultMapper = {
    yellow: 0,
    red: 1,
    pink: 2,
    white: 3,
    blue: 4,
    green: 5
};

export const convertValueToSymbol = (value: number): ColorGameSymbol => {
    switch (value) {
        case resultMapper.yellow: return ColorGameSymbol.YELLOW;
        case resultMapper.red: return ColorGameSymbol.RED;
        case resultMapper.pink: return ColorGameSymbol.PINK;
        case resultMapper.white: return ColorGameSymbol.WHITE;
        case resultMapper.blue: return ColorGameSymbol.BLUE;
        case resultMapper.green: return ColorGameSymbol.GREEN;
        default: return ColorGameSymbol.EMPTY;
    }
};
