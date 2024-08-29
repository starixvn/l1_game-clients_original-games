import { useMemo } from "react";
import Styles from "./bet-option.module.scss";

export interface OddPros {
    value: number;
    namespace?: string;
    choice?: string;
}

export const Odds: React.FC<OddPros> = ({ value }) => {
    return useMemo(() => {
        if (value <= 0) {
            return null;
        }

        return <div className={`${Styles["odd"]}`}>{value}</div>;
    }, [value]);
};

export default Odds;
