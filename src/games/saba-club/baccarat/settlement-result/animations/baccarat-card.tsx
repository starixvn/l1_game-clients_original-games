import React from "react";
import Card from "../../../../../_shared/components/card";
import { CardOrder } from "../../baccarat";
import Styles from "./baccarat-animations.module.scss";

interface BaccaratCardProps {
    card: CardOrder;
}

export const BaccaratCard: React.FC<BaccaratCardProps> = ({ card }) => {
    const classCardOrder = `card${card.order}`;

    return (
        <div className={`${Styles[classCardOrder]}`}>
            <div className={Styles["rotate-card"]}>
                <Card result={card.value} customClassName={"card-baccarat"} />
            </div>
            <div className={`${Styles["card-back"]} `} />
        </div>
    );
};

export const generateResult = (cards: CardOrder[]) => {
    return cards.map((card) => (
        <BaccaratCard key={card.order} card={card} />
    ));
}; 