import React from "react";
import cardFront from "../../../assets/cards/card-front.svg";
import Styles from "./card.module.scss";
import { MiniCard } from "./components/mini-card";
import { Props } from "./type";
import { convertRank, suffixNameMapping } from "./utils/card-utils";
export const EmptyCardIndex = -1;

const Card: React.FC<Props> = (props) => {
    const { result, isSmall, viewMode = "" } = props;
    const customClassName = props.customClassName ?? "";
    const isDisplayMiniCard = isSmall;

    const getCardsDefault = () => {
        const srcPathCard = "../../../assets/cards/";
        const nameCard = `${convertRank(result?.card)}-${suffixNameMapping[result?.type]}.svg`;
        return (
            <div className={Styles["card-front-box"]}>
                 <img
                    src={`${cardFront}#v1`}
                    className={Styles["card-front"]}
                    alt="card-front"
                />
                <img src={`${srcPathCard}${convertRank(result?.card)}.png?v=2`} className={Styles["card-rank"]}/>
                <div className={`${Styles["card-suit"]} ${Styles[`card-${suffixNameMapping[result?.type]}`]}`}></div>
            </div>
           
        );
    };

    if (result.card === EmptyCardIndex) {
        return null;
    }

    return (
        <div className={`${Styles[customClassName]} ${Styles["card"]} `}>
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
