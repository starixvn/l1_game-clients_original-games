import React from "react";
import Card from "../../../../../_shared/components/card";
import { CardOrder } from "../../baccarat";
import Styles from "./baccarat-card.module.scss";

interface BaccaratCardProps {
    card: CardOrder;
    className?: string;
}

export const BaccaratCard: React.FC<BaccaratCardProps> = ({ card, className }) => {
    return (
        <div className={`${Styles.card} card${card.order} ${className || ""}`}>
            <div className={Styles["rotate-card"]}>
                <Card result={card.value} customClassName={"card-baccarat"} />
            </div>
            <div className={Styles["card-back"]} />
        </div>
    );
}; 