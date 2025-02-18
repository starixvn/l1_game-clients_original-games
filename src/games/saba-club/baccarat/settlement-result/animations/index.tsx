import * as gc from "@sg/sg-game-client";
import React from "react";

import Card from "../../../../../_shared/components/card";


import { CardOrder, Result, SettlementResult } from "../../baccarat";
import { GetBankerCardsResult, GetPlayerCardsResult } from "../../baccarat-helper";
import Styles from "./baccarat-animations.module.scss";

const classAnimation = "has-animation";
const classAnimationContainer = "animation-container";
const classMoveUpNoAnimation = "move-up-no-animation";

export const generateResult = (cards: CardOrder[]) => {
    return cards.map((card, _) => {
        const classCardOrder = `card${card.order}`;
        return (
            <div key={card.order} className={`${Styles[classCardOrder]}`}>
                <div className={Styles["rotate-card"]}>
                    <Card result={card.value} customClassName={"card-baccarat"}></Card>
                </div>
                <div className={`${Styles["card-back"]} `}></div>
            </div>
        );
    });
};

const sumScore = (score: number, card: number) => {
    return card + 1 >= 10 ? score : (score + card + 1) % 10;
};

class PlayerBankerResultComponent extends React.PureComponent<
    {
        playResultAnimation: boolean;
        result?: Result;
        texts: any;
    },
    {
        playResultAnimation: boolean;
        result?: Result;
        playerScore: number;
        bankerScore: number;
        texts: any;
        openedCards: number;
    }
> {
    private readonly timeouts: NodeJS.Timeout[] = [];

    constructor(props) {
        super(props);

        this.state = {
            ...props,
            playerScore: 0,
            bankerScore: 0,
            openedCards: 0,
        };
    }

    componentDidMount() {
        if (this.props.playResultAnimation) {
            const cardOpenedTimes = [
                { t: 700, c: this.props.result.player.card1, isBanker: false },
                { t: 1500, c: this.props.result.banker.card1, isBanker: true },
                { t: 2300, c: this.props.result.player.card2, isBanker: false },
                { t: 3100, c: this.props.result.banker.card2, isBanker: true },
                {
                    t: 4400,
                    c: this.props.result.player.card3 ?? this.props.result.banker.card3,
                    isBanker: !this.props.result.player.card3,
                },
                { t: 5800, c: !!this.props.result.player.card3 ? this.props.result.banker.card3 : null, isBanker: true },
            ];

            cardOpenedTimes
                .filter((ct) => !!ct.c)
                .forEach((ct, i) => {
                    const timeout = setTimeout(() => {
                        if (ct.isBanker) {
                            this.setState({
                                bankerScore: sumScore(this.state.bankerScore, ct.c.card),
                                openedCards: i + 1,
                            });
                        } else {
                            this.setState({
                                playerScore: sumScore(this.state.playerScore, ct.c.card),
                                openedCards: i + 1,
                            });
                        }
                    }, ct.t);
                    this.timeouts.push(timeout);
                });
        } else {
            this.updateScorePlayerBanker();
        }
    }

    componentWillUnmount() {
        if (this.timeouts && this.timeouts.length) {
            this.timeouts.forEach((timeout) => {
                clearTimeout(timeout);
            });
        }
    }

    componentDidUpdate() {
        if (!this.props.playResultAnimation) {
            this.updateScorePlayerBanker();
        }
    }

    updateScorePlayerBanker = () => {
        let pc = sumScore(0, this.props.result.player.card1.card);
        pc = sumScore(pc, this.props.result.player.card2.card);
        pc = sumScore(pc, this.props.result.player.card3?.card ?? -1);

        let bc = sumScore(0, this.props.result.banker.card1.card);
        bc = sumScore(bc, this.props.result.banker.card2.card);
        bc = sumScore(bc, this.props.result.banker.card3?.card ?? -1);

        this.setState({
            playerScore: pc,
            bankerScore: bc,
        });
    };

    render() {
        const playerCards = GetPlayerCardsResult(this.props.result);
        const bankerCards = GetBankerCardsResult(this.props.result);
        const classOpenCards = `opened-cards-${this.state.openedCards}`;
        const classGroupPlayerCards = `group-${playerCards.length}-cards`;
        const classGroupBankerCards = `group-${bankerCards.length}-cards`;
        return (
            <div className={`overlay-mask ${Styles[classOpenCards]}`}>
                <div className={`${Styles[classAnimationContainer]}`}>
                    <div
                        className={`${Styles["player"]} ${this.props.playResultAnimation ? "" : Styles[classMoveUpNoAnimation]
                            }`}
                    >
                        {generateResult(playerCards)}
                        <div className={`${Styles[classGroupPlayerCards]} ${Styles["score"]}`}>
                            {this.state.texts.player}
                            <span className={Styles["score-number"]}>{this.state.playerScore}</span>
                        </div>
                    </div>

                    <div
                        className={`${Styles["banker"]} ${this.props.playResultAnimation ? "" : Styles[classMoveUpNoAnimation]
                            }`}
                    >
                        {generateResult(bankerCards)}
                        <div className={`${Styles[classGroupBankerCards]} ${Styles["score"]}`}>
                            {this.state.texts.banker}
                            <span className={Styles["score-number"]}>{this.state.bankerScore}</span>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export { default as BaccaratResult } from "./baccarat-result";
export { PlayerBankerResultComponent } from "./player-banker-result";

export const generateSettlementInfo = (settlementResult: SettlementResult, resources: Object, isShowTicketHistory = false) => {
    const resultCount = 2 + (settlementResult.playerPair ? 1 : 0) + (settlementResult.bankerPair ? 1 : 0);
    const classResultInfoBlue = "result-info-blue";
    const classResultInfoRed = "result-info-red";
    const classResultCount = `result-${resultCount}`;
    return (
        <div className={`${Styles["result-container"]} ${Styles[classResultCount]} ${isShowTicketHistory && Styles["ticket-history"]}`}>
            {settlementResult.player ? (
                <div className={Styles[classResultInfoBlue]}>{resources["player"]}</div>
            ) : settlementResult.banker ? (
                <div className={Styles[classResultInfoRed]}>{resources["banker"]}</div>
            ) : (
                <div className={Styles["result-info-green"]}>{resources["tie"]}</div>
            )}
            {settlementResult.big ? (
                <div className={Styles[classResultInfoBlue]}>{resources["big"]}</div>
            ) : (
                <div className={Styles[classResultInfoRed]}>{resources["small"]}</div>
            )}
            {settlementResult.playerPair ? (
                <div className={`${Styles[classResultInfoBlue]} ${Styles["result-player-pair"]}`}>{resources["playerPair"]}</div>
            ) : (
                <></>
            )}
            {settlementResult.bankerPair ? (
                <div className={`${Styles[classResultInfoRed]} ${Styles["result-banker-pair"]}`}>{resources["bankerPair"]}</div>
            ) : (
                <></>
            )}
        </div>
    );
};
