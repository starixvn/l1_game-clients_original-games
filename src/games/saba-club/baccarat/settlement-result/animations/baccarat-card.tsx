import React from "react";
import Card from "../../../../../_shared/components/card";
import { CardOrder } from "../../baccarat";
import Styles from "./baccarat-card.module.scss";

interface BaccaratCardProps {
    card: CardOrder;
}

export const BaccaratCard: React.FC<BaccaratCardProps> = ({ card }) => {
    return (
        <div className={`${Styles.card} card${card.order}`}>
            <div className={Styles["rotate-card"]}>
                <Card result={card.value} customClassName={"card-baccarat"} />
            </div>
            <div className={Styles["card-back"]} />
        </div>
    );
}; 