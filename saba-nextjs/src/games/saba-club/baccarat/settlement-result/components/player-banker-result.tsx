import React, { useEffect, useState } from "react";
import { Result } from "../../baccarat";
import { GetBankerCardsResult, GetPlayerCardsResult } from "../../baccarat-helper";
import Styles from "../styles/baccarat-animations.module.scss";
import { calculateTotalScore } from "./score-utils";
import { CardSection } from "./card-section";

interface PlayerBankerResultProps {
    playResultAnimation: boolean;
    result?: Result;
    texts: {
        player: string;
        banker: string;
    };
    isShowResult: boolean;
}

interface PlayerBankerResultState {
    playerScore: number;
    bankerScore: number;
    openedCards: number;
    showWinner: boolean;
}

export default function PlayerBankerResultComponent(props: PlayerBankerResultProps) {
    const { playResultAnimation, result, texts, isShowResult } = props;
    const [state, setState] = useState<PlayerBankerResultState>({
        playerScore: 0,
        bankerScore: 0,
        openedCards: 0,
        showWinner: false
    });

    useEffect(() => {
        if (playResultAnimation) {
            startAnimation();
        } else {
            updateScorePlayerBanker();
        }
    }, [playResultAnimation]);

    useEffect(() => {
        if (isShowResult) {
            startAnimation();
        }
    }, [isShowResult]);

    useEffect(() => {
        if (result && !playResultAnimation) {
            updateScorePlayerBanker();
        }
    }, [result, playResultAnimation]);

    const getWinnerText = () => {
        const { playerScore, bankerScore } = state;

        if (playerScore > bankerScore) {
            return `${texts.player} WINS!`;
        } else if (bankerScore > playerScore) {
            return `${texts.banker} WINS!`;
        }
        return "TIE";
    }

    const startAnimation = () => {
        if (!result) return;

        const playerCards = GetPlayerCardsResult(result);
        const bankerCards = GetBankerCardsResult(result);

        // Combine and sort cards by animation order
        const allCards = [...playerCards, ...bankerCards]
            .sort((a, b) => a.order - b.order)
            .filter(card => card.value);

        allCards.forEach((card, index) => {
            setTimeout(() => {
                setState(prevState => {
                    const isBanker = bankerCards.some(bc => bc.value === card.value);
                    return {
                        bankerScore: isBanker ? card.accumulatedScore : prevState.bankerScore,
                        playerScore: !isBanker ? card.accumulatedScore : prevState.playerScore,
                        openedCards: index + 1,
                        showWinner: index === allCards.length - 1
                    };
                });
            }, card.animationDelay);
        });
    };

    const updateScorePlayerBanker = () => {
        if (result) {
            setState(prevState => ({
                ...prevState,
                playerScore: calculateTotalScore([result.player.card1, result.player.card2, result.player.card3]),
                bankerScore: calculateTotalScore([result.banker.card1, result.banker.card2, result.banker.card3])
            }));
        }
    };

    const { openedCards, playerScore, bankerScore, showWinner } = state;

    const playerCards = GetPlayerCardsResult(result);
    const bankerCards = GetBankerCardsResult(result);
    const classOpenCards = `opened-cards-${openedCards}`;

    return (
        <div className={`overlay-mask ${Styles[classOpenCards]}`}>
            <div className={Styles["animation-container"]}>
                <CardSection
                    cards={playerCards}
                    label={texts.player}
                    score={playerScore}
                    type="player"
                    playResultAnimation={playResultAnimation}
                    isShowResult={isShowResult}
                />

                {/* Winner Display */}
                {showWinner && isShowResult && (
                    <div className={Styles['winner-display']}>
                        <p className={Styles['winner-text']}>
                            {getWinnerText()}
                        </p>
                    </div>
                )}

                <CardSection
                    cards={bankerCards}
                    label={texts.banker}
                    score={bankerScore}
                    type="banker"
                    playResultAnimation={playResultAnimation}
                    isShowResult={isShowResult}
                />
            </div>
        </div>
    );
} 