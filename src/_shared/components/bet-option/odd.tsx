import * as gc from "@sg/sg-game-client";
import { useMemo } from "react";
import Styles from "./bet-option.module.scss";

export interface OddPros {
    value: number;

    fractional: boolean;
    namespace?: string;
    choice?: string;
    isBoostedChoice?: boolean;
}

export const Odds: React.FC<OddPros> = ({ value, fractional, isBoostedChoice }) => {
    return useMemo(() => {
        if (value <= 0) {
            return null;
        }

        const boostedChoiceClass = isBoostedChoice ? Styles["boosted-odd"] : "";
        return <div className={`${Styles["odd"]} ${boostedChoiceClass}`}>{gc.FormatUtils.formatOdds(value, fractional)}</div>;
    }, [value, isBoostedChoice]);
};

export default Odds;
