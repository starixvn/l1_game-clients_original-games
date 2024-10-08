import { Translator } from "@sg/sg-game-client";
import Styles from "./scoreboard.module.scss";
import { hasBlink } from "./helper";
import { OddEvenBigRoadConverter, OverUnderBigRoadConverter } from "./converters";
import { ScoreboardDotContent } from "./types";
type Props = {
    gameName: string;
    rows: any[];
    scoreboardCharacter: ScoreboardDotContent;
    scoreboardDotClassName: ScoreboardDotContent;
};

const ScoreBoard: React.FunctionComponent<Props> = ({ gameName, rows, scoreboardCharacter, scoreboardDotClassName }) => {
    const translateCharacter = (option) => Translator.t(`${gameName}.beadboard_${option}`);
    const { positiveDotContent: positiveCharacter, negativeDotContent: negativeCharacter } = scoreboardCharacter;
    const { positiveDotContent: positiveClassName, negativeDotContent: negativeClassName } = scoreboardDotClassName;
    const getDotClass = (status: boolean) => {
        return status ? Styles[positiveClassName] : Styles[negativeClassName];
    };

    return (
        <>
            {rows.map((row, row_index) => {
                return row.map((point, col_index) => {
                    const emptyDot = <div className={Styles["dot-item"]} key={`${row_index}_${col_index}`}></div>;
                    const blinkDot = <div className={Styles["dot-blink"]}></div>;

                    const character = translateCharacter(point.status ? positiveCharacter : negativeCharacter);
                    const dot = <div className={getDotClass(point.status)}>{character}</div>;

                    const contentDot = (
                        <div
                            className={Styles["dot-item"]}
                            style={{ gridColumnStart: col_index + 1, gridRowStart: row_index + 1 }}
                            key={`${row_index}_${col_index}`}
                        >
                            {point.isBlink ? blinkDot : dot}
                        </div>
                    );

                    return point.status === undefined ? emptyDot : contentDot;
                });
            })}
        </>
    );
};

export { ScoreBoard, hasBlink, OddEvenBigRoadConverter, OverUnderBigRoadConverter };
