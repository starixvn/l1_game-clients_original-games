import { ColorGameSymbol } from "../../../_shared/components/color-game-dice";
import { ColorGameChoices } from "./type";

// Map string keys to numeric values
export const resultMapper = {
    yellow: 0,
    red: 1,
    pink: 2,
    white: 3,
    blue: 4,
    green: 5
};

// Convert numeric value to ColorGameSymbol enum
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

// Map ColorGameSymbol enum values to string values
export const symbolToStringMap = {
    [ColorGameSymbol.YELLOW]: 'yellow',
    [ColorGameSymbol.RED]: 'red',
    [ColorGameSymbol.PINK]: 'pink',
    [ColorGameSymbol.WHITE]: 'white',
    [ColorGameSymbol.BLUE]: 'blue',
    [ColorGameSymbol.GREEN]: 'green',
}

// Map choices to their display icons/patterns
export const choiceToSymbolMap: Record<ColorGameChoices, ColorGameSymbol> = {
    [ColorGameChoices.yellow]: ColorGameSymbol.YELLOW,
    [ColorGameChoices.red]: ColorGameSymbol.RED,
    [ColorGameChoices.pink]: ColorGameSymbol.PINK,
    [ColorGameChoices.white]: ColorGameSymbol.WHITE,
    [ColorGameChoices.blue]: ColorGameSymbol.BLUE,
    [ColorGameChoices.green]: ColorGameSymbol.GREEN
};

// Create empty settlement result template
export const createEmptySettlementResult = () => ({
    winner: ColorGameChoices.yellow,
    [ColorGameChoices.yellow]: false,
    [ColorGameChoices.red]: false,
    [ColorGameChoices.pink]: false,
    [ColorGameChoices.white]: false,
    [ColorGameChoices.blue]: false,
    [ColorGameChoices.green]: false
});

// Mapping for odds
export const oddMapper = { 1: "single", 2: "double", 3: "triple" };
