import * as gc from "@sg/sg-game-client";
import { Result } from "../../baccarat";
import { GetBankerCardsResult, GetPlayerCardsResult } from "../../baccarat-helper";
import Styles from "../styles/baccarat-animations.module.scss";
import { CardSection } from "./card-section";
import { determineWinner, calculateScores } from './score-utils';

interface PlayerBankerResultProps {
    playResultAnimation: boolean;
    result?: Result;
    isShowResult: boolean;
    language: string;
}

export default function PlayerBankerResultComponent(props: PlayerBankerResultProps) {
    const { playResultAnimation, result, isShowResult, language } = props;

    const playerCards = result ? GetPlayerCardsResult(result) : [];
    const bankerCards = result ? GetBankerCardsResult(result) : [];

    const getWinnerText = (): string => {
        if (!result) return '';

        try {
            const scores = calculateScores(result);
            if (!scores) return '';

            return determineWinner(scores.playerScore, scores.bankerScore);
        } catch (error) {
            console.error('Error calculating winner:', error);
            return '';
        }
    }

    return (
        <div className={`overlay-mask `}>
            <div className={Styles["animation-container"]}>
                <CardSection
                    cards={playerCards}
                    label={gc.Translator.t(`Baccarat.glossary_player`, { lng: language })}
                    type="player"
                    playResultAnimation={playResultAnimation}
                    isShowResult={isShowResult}
                />

                {/* Winner Display */}
                {isShowResult && playerCards.length > 2 && (
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