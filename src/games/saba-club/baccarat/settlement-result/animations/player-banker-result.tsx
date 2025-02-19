import React from "react";
import { Result } from "../../baccarat";
import { GetBankerCardsResult, GetPlayerCardsResult, CardAnimationConfig } from "../../baccarat-helper";
import Styles from "./baccarat-animations.module.scss";
import { BaccaratCard } from "./baccarat-card";
import { ScoreDisplay } from "./score-display";
import { calculateTotalScore, sumScore } from "./score-utils";
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
}

export class PlayerBankerResultComponent extends React.PureComponent<PlayerBankerResultProps, PlayerBankerResultState> {
    private readonly timeouts: NodeJS.Timeout[] = [];

    constructor(props: PlayerBankerResultProps) {
        super(props);

        this.state = {
            playerScore: 0,
            bankerScore: 0,
            openedCards: 0,
        };
    }

    componentDidMount() {
        if (this.props.playResultAnimation) {
            this.startAnimation();
        } else {
            this.updateScorePlayerBanker();
        }
    }

    componentWillUnmount() {
        this.timeouts.forEach(clearTimeout);
    }

    componentDidUpdate(prevProps: PlayerBankerResultProps) {
        if (this.props.isShowResult !== prevProps.isShowResult) {
            this.setState({
                playerScore: 0,
                bankerScore: 0,
                openedCards: 0,
            });
            if (this.props.isShowResult) {
                this.startAnimation();
            }
        } else if (!this.props.playResultAnimation && prevProps.result !== this.props.result) {
            this.updateScorePlayerBanker();
        }
    }

    private startAnimation = () => {
        const { result } = this.props;
        console.log('Starting animation with result:', result);

        const playerCards = GetPlayerCardsResult(result);
        const bankerCards = GetBankerCardsResult(result);

        // Combine and sort cards by animation order
        const allCards = [...playerCards, ...bankerCards]
            .sort((a, b) => a.order - b.order)
            .filter(card => card.value);

        this.timeouts.forEach(clearTimeout);
        this.timeouts.length = 0;

        allCards.forEach((card, index) => {
            console.log(`Setting timeout for card: ${card.value.card}, order: ${card.order}, delay: ${card.animationDelay}`);
            const timeout = setTimeout(() => {
                this.setState(prevState => {
                    const isBanker = bankerCards.some(bc => bc.value === card.value);
                    const newState = {
                        bankerScore: isBanker ? sumScore(prevState.bankerScore, card.value.card) : prevState.bankerScore,
                        playerScore: !isBanker ? sumScore(prevState.playerScore, card.value.card) : prevState.playerScore,
                        openedCards: index + 1,
                    };
                    console.log('Updated state:', newState);
                    return newState;
                });
            }, card.animationDelay);
            this.timeouts.push(timeout);
        });
    };

    private updateScorePlayerBanker = () => {
        const { result } = this.props;
        this.setState({
            playerScore: calculateTotalScore([result.player.card1, result.player.card2, result.player.card3]),
            bankerScore: calculateTotalScore([result.banker.card1, result.banker.card2, result.banker.card3]),
        });
    };

    render() {
        const { playResultAnimation, result, texts, isShowResult } = this.props;
        const { openedCards, playerScore, bankerScore } = this.state;

        const playerCards = GetPlayerCardsResult(result);
        const bankerCards = GetBankerCardsResult(result);
        const classOpenCards = `opened-cards-${openedCards}`;

        console.log('playerCards', playerCards);
        console.log('bankerCards', bankerCards);
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
} 