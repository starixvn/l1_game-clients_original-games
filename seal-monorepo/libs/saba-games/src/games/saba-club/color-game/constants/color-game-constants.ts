import { ColorGameChoices } from "../type";
import { ColorGameSymbol } from "../../../../_shared/components/color-game-dice";

// Map ColorGameChoices to ColorGameSymbol
export const choiceToSymbol: Record<ColorGameChoices, ColorGameSymbol> = {
    [ColorGameChoices.yellow]: ColorGameSymbol.YELLOW,
    [ColorGameChoices.red]: ColorGameSymbol.RED,
    [ColorGameChoices.pink]: ColorGameSymbol.PINK,
    [ColorGameChoices.white]: ColorGameSymbol.WHITE,
    [ColorGameChoices.blue]: ColorGameSymbol.BLUE,
    [ColorGameChoices.green]: ColorGameSymbol.GREEN,
};

export const MAX_DISPLAYED_ROUNDS = 3; 