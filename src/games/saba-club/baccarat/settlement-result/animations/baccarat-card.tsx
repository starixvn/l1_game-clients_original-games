import React from "react";
import Card from "../../../../../_shared/components/card";
import { CardOrder } from "../../baccarat";
import Styles from "./baccarat-card.module.scss";
import CardBack from "../../../../../_shared/components/card/card-back";

interface BaccaratCardProps {
    card: CardOrder;
    className?: string;
    isShowResult: boolean;
    animationDuration: number;
}

export const BaccaratCard: React.FC<BaccaratCardProps> = ({ card, className, isShowResult, animationDuration }) => {
    return (
        <div className={`${Styles.card} card${card.order} ${className || ""}`} style={{ animationDuration: `${animationDuration}s` }}>
            <div className={Styles["rotate-card"]}>
                {isShowResult && <Card result={card.value} customClassName={"card-baccarat"} />}
                {!isShowResult && <CardBack />}
            </div>
        </div>
    );
}; 