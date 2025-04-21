import { FishPrawnCrabSymbol } from "../../../_shared/components/fish-prawn-crab-dice";

// Result mapper for Fish Prawn Crab game
export const resultMapper = {
    stag: 0,
    gourd: 1,
    rooster: 2,
    fish: 3,
    crab: 4,
    prawn: 5
};

/**
 * Converts a result value to the corresponding FishPrawnCrabSymbol
 */
export const convertValueToSymbol = (value: number): FishPrawnCrabSymbol => {
    switch (value) {
        case resultMapper.stag: return FishPrawnCrabSymbol.STAG;
        case resultMapper.gourd: return FishPrawnCrabSymbol.GOURD;
        case resultMapper.rooster: return FishPrawnCrabSymbol.ROOSTER;
        case resultMapper.fish: return FishPrawnCrabSymbol.FISH;
        case resultMapper.crab: return FishPrawnCrabSymbol.CRAB;
        case resultMapper.prawn: return FishPrawnCrabSymbol.PRAWN;
        default: return FishPrawnCrabSymbol.EMPTY;
    }
};
