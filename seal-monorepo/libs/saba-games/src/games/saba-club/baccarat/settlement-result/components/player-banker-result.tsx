import * as gc from "@sg/sg-game-client";
import { Result } from "../../baccarat";
import { GetBankerCardsResult, GetPlayerCardsResult } from "../../baccarat-helper";
import Styles from "../styles/baccarat-animations.module.scss";
import { CardSection } from "./card-section";
import { determineWinner } from './score-utils';
import { useEffect, useState } from "react";

interface PlayerBankerResultProps {
    playResultAnimation: boolean;
    result?: Result;
    isShowResult: boolean;
    language: string;
}
interface PlayerBankerResultState {
    openedCards: number;
    showWinner: boolean;
}

export default function PlayerBankerResultComponent(props: PlayerBankerResultProps) {
    const { playResultAnimation, result, isShowResult, language } = props;
    console.log('PlayerBankerResultComponent rendered:', {
        playResultAnimation,
        isShowResult,
        language,
        hasResult: !!result
    });

    const [state, setState] = useState<PlayerBankerResultState>({
        openedCards: 0,
        showWinner: false
    });

    const playerCards = result ? GetPlayerCardsResult(result) : [];
    const bankerCards = result ? GetBankerCardsResult(result) : [];

    console.log('Initial cards state:', {
        playerCardsCount: playerCards.length,
        bankerCardsCount: bankerCards.length,
        playerCards,
        bankerCards
    });

    useEffect(() => {
        console.log('playResultAnimation effect triggered:', { playResultAnimation });
        if (playResultAnimation) {
            startAnimation();
        }
    }, [playResultAnimation]);

    useEffect(() => {
        console.log('isShowResult effect triggered:', { isShowResult });
        if (isShowResult) {
            startAnimation();
        }
    }, [isShowResult]);

    const getWinnerText = (): string => {
        console.log('getWinnerText called with result:', result);

        if (!result) {
            console.log('No result available, returning empty string');
            return '';
        }

        try {
            const playerLastCard = playerCards[playerCards.length - 1];
            const bankerLastCard = bankerCards[bankerCards.length - 1];

            if (!playerLastCard || !bankerLastCard) {
                console.log('Missing final cards for player or banker');
                return '';
            }

            const playerScore = playerLastCard.accumulatedScore;
            const bankerScore = bankerLastCard.accumulatedScore;

            console.log('Final scores:', {
                playerScore,
                bankerScore,
                playerLastCard,
                bankerLastCard
            });

            const winner = determineWinner(playerScore, bankerScore);
            console.log('Winner determined:', winner);
            return winner;
        } catch (error) {
            console.error('Error in getWinnerText:', {
                error,
                errorMessage: error instanceof Error ? error.message : 'Unknown error',
                result: JSON.stringify(result)
            });
            return '';
        }
    }

    const startAnimation = () => {
        console.log('Starting animation sequence');
        if (!result) {
            console.log('No result available for animation');
            return;
        }

        console.log('Animation cards:', {
            playerCards,
            bankerCards
        });

        // Combine and sort cards by animation order
        const allCards = [...playerCards, ...bankerCards]
            .sort((a, b) => a.order - b.order)
            .filter(card => card.value);

        console.log('Sorted animation cards:', {
            totalCards: allCards.length,
            cards: allCards
        });

        allCards.forEach((card, index) => {
            console.log(`Scheduling card animation ${index + 1}/${allCards.length}:`, {
                card,
                delay: card.animationDelay
            });

            setTimeout(() => {
                setState(prevState => {
                    const newState = {
                        openedCards: index + 1,
                        showWinner: index === allCards.length - 1
                    };
                    console.log('Updating animation state:', {
                        previousState: prevState,
                        newState
                    });
                    return newState;
                });
            }, card.animationDelay);
        });
    };

    const { openedCards, showWinner } = state;
    console.log('Current component state:', { openedCards, showWinner });

    const classOpenCards = `opened-cards-${openedCards}`;

    return (
        <div className={`overlay-mask ${Styles[classOpenCards]}`}>
            <div className={Styles["animation-container"]}>
                <CardSection
                    cards={playerCards}
                    label={gc.Translator.t(`Baccarat.glossary_player`, { lng: language })}
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
                    type="banker"
                    playResultAnimation={playResultAnimation}
                    isShowResult={isShowResult}
                />
            </div>
        </div>
    );
} 