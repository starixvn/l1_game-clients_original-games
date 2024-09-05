import * as gc from "@sg/sg-game-client";
import { useMemo } from "react";
import Styles from "./bet-option.module.scss";

export interface OddPros {
    value: number;

    fractional: boolean;
    namespace?: string;
    choice?: string;
}

export const Odds: React.FC<OddPros> = ({ value, fractional }) => {
    return useMemo(() => {
        if (value <= 0) {
            return null;
        }

        return <div className={`${Styles["odd"]}`}>{gc.FormatUtils.formatOdds(value, fractional)}</div>;
    }, [value]);
};

export default Odds;
