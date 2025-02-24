import React from "react";
import Card from "../../../../_shared/components/card";
import { CardType } from "../baccarat";
import Styles from "./result-baccarat-card.module.scss";

interface StaticBaccaratCardProps {
    card: CardType;
    className?: string;
}

export const ResultStaticBaccaratCard: React.FC<StaticBaccaratCardProps> = ({
    card,
    className
}) => {
    console.log(card);
    return (
        <div className={`${Styles.card} ${Styles[`card`]}${className || ''}`}>
            <div className={Styles["rotate-card"]}>
                <div className={Styles.cardFace}>
                    <div className={Styles["card-flip"]}>
                        <Card result={card} customClassName={"card-baccarat"} />
                    </div>
                </div>
            </div>
        </div>
    );
}; 