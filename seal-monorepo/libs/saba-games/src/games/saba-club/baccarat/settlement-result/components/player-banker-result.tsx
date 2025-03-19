import * as gc from "@sg/sg-game-client";
import { useEffect, useState } from "react";

import { Result } from "../../baccarat";
import { cardStateEmitter } from "../../services/card-state-emitter";
import Styles from "../styles/baccarat-animations.module.scss";
import { CardSection } from "./card-section";
import { determineWinner, GetBankerCardsResult, GetPlayerCardsResult } from "./score-utils";

interface PlayerBankerResultProps {
    playResultAnimation: boolean;
    result?: Result;
    isShowResult: boolean;
    language: string;
    isFinishShowResult: boolean;
}
interface PlayerBankerResultState {
    openedCards: number;
    showWinner: boolean;
}

export default function PlayerBankerResultComponent(props: PlayerBankerResultProps) {
    const { playResultAnimation, result, isShowResult, language, isFinishShowResult } = props;

    const [state, setState] = useState<PlayerBankerResultState>({
        openedCards: 0,
        showWinner: false,
    });

    const playerCards = result ? GetPlayerCardsResult(result) : [];
    const bankerCards = result ? GetBankerCardsResult(result) : [];

    useEffect(() => {
        if (playResultAnimation) {
            startAnimation();
        }

        if (isShowResult && !playResultAnimation) {
            setState({
                openedCards: 0,
                showWinner: true,
            });
        }
    }, [playResultAnimation, isShowResult]);

    useEffect(() => {
        if (isShowResult) {
            startAnimation();
        }
    }, [isShowResult]);

    const getWinnerText = (): string => {
        if (!result) {
            return '';
        }

        try {
            const playerLastCard = playerCards[playerCards.length - 1];
            const bankerLastCard = bankerCards[bankerCards.length - 1];

            if (!playerLastCard || !bankerLastCard) {
                return '';
            }

            const playerScore = playerLastCard.accumulatedScore;
            const bankerScore = bankerLastCard.accumulatedScore;

            return determineWinner(playerScore, bankerScore);
        } catch (error) {
            return '';
        }
    };

    const startAnimation = () => {
        if (!result) {
            return;
        }

        const allCards = [...playerCards, ...bankerCards].sort((a, b) => a.order - b.order).filter((card) => card.value);

        allCards.forEach((card, index) => {
            setTimeout(() => {
                const showWinner = index === allCards.length - 1;
                setState({
                    openedCards: index + 1,
                    showWinner: showWinner,
                });
                cardStateEmitter.emitOpenedCardsChange(index + 1);
            }, card.animationDelay);
        });
    };

    const { showWinner } = state;

    return (
        <div className={`overlay-mask`}>
            <div className={Styles['animation-container']}>
                <CardSection
                    cards={playerCards}
                    label={gc.Translator.t(`Baccarat.glossary_player`, { lng: language })}
                    type="player"
                    playResultAnimation={playResultAnimation}
                    isShowResult={isShowResult}
                />

                <CardSection
                    cards={bankerCards}
                    label={gc.Translator.t(`Baccarat.glossary_banker`, { lng: language })}
                    type="banker"
                    playResultAnimation={playResultAnimation}
                    isShowResult={isShowResult}
                />

                {isShowResult && isFinishShowResult && (
                    <div className={`${Styles['winner-display']} ${playResultAnimation ? Styles['play-animation'] : ''}`}>
                        <p className={Styles['winner-text']}>{gc.Translator.t(`Baccarat.${getWinnerText()}`, { lng: language })}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
