import Styles from "./dot.module.scss";

type Props = {
    choice?: string;
    row?: number;
    col?: number;
    value?: number | string | object;
    highlight?: boolean;
    size?: string;
    gameName?: string;
    className?: string;
};
export const RoundDot: React.FunctionComponent<Props> = ({ choice = "even", value, highlight = false, size = "", gameName, className = "" }) => {
    const classDotName = `dot-${choice}`;
    console.log("RoundDot Props:", { choice, value, highlight, size, gameName, className });
    console.log("Computed classDotName:", classDotName);
    return (
        <div
            className={`${Styles[classDotName]} ${highlight ? Styles["highlight-current-result"] : ""} ${Styles[size]}  ${gameName ? Styles[gameName] : ""} ${className}`}
            data-testid="round-dot"
        >
            {value}
        </div>
    );
};
