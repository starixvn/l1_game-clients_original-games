import React, { useEffect, useState } from "react";
import * as gc from "@sg/sg-game-client";
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
    language: string;
}

interface PlayerBankerResultState {
    playerScore: number;
    bankerScore: number;
    openedCards: number;
    showWinner: boolean;
}

export default function PlayerBankerResultComponent(props: PlayerBankerResultProps) {
    const { playResultAnimation, result, texts, isShowResult, language } = props;
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
            return `player_win`;
        } else if (bankerScore > playerScore) {
            return `banker_win`;
        }
        return `tie_win`;
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

    const playerCards = result ? GetPlayerCardsResult(result) : [];
    const bankerCards = result ? GetBankerCardsResult(result) : [];
    const classOpenCards = `opened-cards-${openedCards}`;

    return (
        <div className={`overlay-mask ${Styles[classOpenCards]}`}>
            <div className={Styles["animation-container"]}>
                <CardSection
                    cards={playerCards}
                    label={gc.Translator.t(`Baccarat.glossary_player`, { lng: language })}
                    score={playerScore}
                    type="player"
                    playResultAnimation={playResultAnimation}
                    isShowResult={isShowResult}
                />

                {/* Winner Display */}
                {showWinner && isShowResult && (
                    <div className={Styles['winner-display']}>
                        <p className={Styles['winner-text']}>
                            {gc.Translator.t(`Baccarat.${getWinnerText()}`, { lng: language })}
                        </p>
                    </div>
                )}

                <CardSection
                    cards={bankerCards}
                    label={gc.Translator.t(`Baccarat.glossary_banker`, { lng: language })}
                    score={bankerScore}
                    type="banker"
                    playResultAnimation={playResultAnimation}
                    isShowResult={isShowResult}
                />
            </div>
        </div>
    );
} 