import React from "react";
import FishPrawnCrabDice, { FishPrawnCrabSymbol } from "../../../../_shared/components/fish-prawn-crab-dice";
import { Size } from "../../../../_shared/constants";

interface IEmptyDiceRowProps {
    count?: number;
    size?: typeof Size[keyof typeof Size];
}

export const EmptyDiceRow: React.FC<IEmptyDiceRowProps> = ({
    count = 3,
    size = Size.medium
}) => {
    return (
        <>
            {Array(count).fill(0).map((_, index) => (
                <FishPrawnCrabDice
                    key={`empty-dice-${index}`}
                    data-testid={`empty-dice-${index}`}
                    symbol={FishPrawnCrabSymbol.EMPTY}
                    size={size}
                />
            ))}
        </>
    );
};

export default EmptyDiceRow; 