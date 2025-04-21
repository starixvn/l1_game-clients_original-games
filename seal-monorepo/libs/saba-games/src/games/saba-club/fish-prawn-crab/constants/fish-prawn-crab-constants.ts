import { FishPrawnCrabChoices } from "../type";
import { FishPrawnCrabSymbol } from "../../../../_shared/components/fish-prawn-crab-dice";

// Map FishPrawnCrabChoices to FishPrawnCrabSymbol
export const choiceToSymbol: Record<FishPrawnCrabChoices, FishPrawnCrabSymbol> = {
    [FishPrawnCrabChoices.fish]: FishPrawnCrabSymbol.FISH,
    [FishPrawnCrabChoices.prawn]: FishPrawnCrabSymbol.PRAWN,
    [FishPrawnCrabChoices.crab]: FishPrawnCrabSymbol.CRAB,
    [FishPrawnCrabChoices.rooster]: FishPrawnCrabSymbol.ROOSTER,
    [FishPrawnCrabChoices.gourd]: FishPrawnCrabSymbol.GOURD,
    [FishPrawnCrabChoices.stag]: FishPrawnCrabSymbol.STAG,
};

export const MAX_DISPLAYED_ROUNDS = 3; 