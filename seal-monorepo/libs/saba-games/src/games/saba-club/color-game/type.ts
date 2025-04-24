import { ColorGameSymbol } from "../../../_shared/components/color-game-dice";

export enum ColorGameOddsType {
    single = 'single',
    double = 'double',
    triple = 'triple'
}

export enum ColorGameChoices {
    yellow = 'yellow',
    red = 'red',
    pink = 'pink',
    white = 'white',
    blue = 'blue',
    green = 'green'
}

export type ColorGameSymbolType = keyof typeof ColorGameChoices;

export const topChoices = [
    ColorGameChoices.yellow,
    ColorGameChoices.white,
    ColorGameChoices.pink
];

export const bottomChoices = [
    ColorGameChoices.blue,
    ColorGameChoices.red,
    ColorGameChoices.green
];

export type ColorGameResult = {
    [key in ColorGameSymbolType]?: boolean;
};

export type ColorGameSettlementResult = {
    [key in ColorGameSymbolType]?: boolean;
};

// Map choices to their display icons/patterns
export const ChoiceColorGameIconMapper: { [key: string]: ColorGameSymbol } = {
    [ColorGameChoices.yellow]: ColorGameSymbol.YELLOW,
    [ColorGameChoices.red]: ColorGameSymbol.RED,
    [ColorGameChoices.pink]: ColorGameSymbol.PINK,
    [ColorGameChoices.white]: ColorGameSymbol.WHITE,
    [ColorGameChoices.blue]: ColorGameSymbol.BLUE,
    [ColorGameChoices.green]: ColorGameSymbol.GREEN
};

export interface ColorGameBet {
    symbol: ColorGameSymbolType;
    amount: number;
}

export interface ColorGameRound {
    roundId: string;
    status: 'placingBets' | 'lockingBet' | 'showingResult' | 'finished';
    startTime: number;
    endTime: number;
    result?: ColorGameResult;
    bets?: ColorGameBet[];
} 