import React from "react";
import { MiniCard } from "./components/mini-card";
import { getClassFollowCondition, convertRank, suffixNameMapping } from "./utils/card-utils";
import { Props } from "./type";
import Styles from "./card.module.scss";

const Card: React.FC<Props> = (props) => {
    const { result, isSmall, viewMode = "" } = props;
    const customClassName = props.customClassName ?? "";
    const isDisplayMiniCard = isSmall;

    const getCardsDefault = () => {
        const nameCard = `${convertRank(result.card)}-${suffixNameMapping[result.type]}.svg`;
        return (
            <img
                src={`/static/images/cards/${nameCard}#v1`}
                className={Styles["card-suite"]}
                height={55}
                width={40}
                alt="suite"
            />
        );
    };

    return (
        <div className={`${Styles[customClassName]} ${Styles["card"]} ${Styles[getClassFollowCondition({ viewMode, isSmall })]}`}>
            <div className={Styles["card-shadow"]}></div>
            <div className={Styles["result"]} data-testid="result-card">
                {isDisplayMiniCard ? (
                    <MiniCard card={result.card} type={result.type} />
                ) : (
                    getCardsDefault()
                )}
            </div>
        </div>
    );
};

export default Card;
