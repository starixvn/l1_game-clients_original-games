import { Translator } from "@sg/sg-game-client";
import Styles from "./scoreboard.module.scss";
import { hasBlink } from "./helper";
import { OddEvenBigRoadConverter, OverUnderBigRoadConverter } from "./converters";
import { ScoreboardItemContent } from "./types";

type Props = {
    gameName: string;
    rows: any[];
    scoreboardCharacter: ScoreboardItemContent;
    scoreboardDotClassName: ScoreboardItemContent;
    useImages?: boolean;
    imageConfig?: {
        positiveImage: string;
        negativeImage: string;
        blinkImage?: string;
    };
};

const ScoreBoard: React.FunctionComponent<Props> = ({
    gameName,
    rows,
    scoreboardCharacter,
    scoreboardDotClassName,
    useImages,
    imageConfig
}) => {
    const translateCharacter = (option) => Translator.t(`${gameName}.beadboard_${option}`);
    const { positiveItemContent: positiveCharacter, negativeItemContent: negativeCharacter } = scoreboardCharacter;
    const { positiveItemContent: positiveClassName, negativeItemContent: negativeClassName } = scoreboardDotClassName;

    const getDotClass = (status: boolean) => {
        return status ? Styles[positiveClassName] : Styles[negativeClassName];
    };

    const renderDot = (status: boolean, isBlink: boolean) => {
        if (useImages && imageConfig) {
            const imagePath = isBlink
                ? (imageConfig.blinkImage || '/static/images/baccarat/scoreboard/big-road/Rectangle 9391.png')
                : (status ? imageConfig.positiveImage : imageConfig.negativeImage);

            return (
                <div className={Styles["dot-image"]}>
                    <img src={imagePath} alt={status ? positiveCharacter : negativeCharacter} />
                </div>
            );
        }

        const character = translateCharacter(status ? positiveCharacter : negativeCharacter);
        return <div className={getDotClass(status)}>{character}</div>;
    };

    return (
        <>
            {rows.map((row, row_index) => {
                return row.map((point, col_index) => {
                    if (point.status === undefined) {
                        return <div className={Styles["dot-item"]} key={`${row_index}_${col_index}`}></div>;
                    }

                    return (
                        <div
                            className={Styles["dot-item"]}
                            style={{ gridColumnStart: col_index + 1, gridRowStart: row_index + 1 }}
                            key={`${row_index}_${col_index}`}
                        >
                            {renderDot(point.status, point.isBlink)}
                        </div>
                    );
                });
            })}
        </>
    );
};

export { ScoreBoard, hasBlink, OddEvenBigRoadConverter, OverUnderBigRoadConverter };
