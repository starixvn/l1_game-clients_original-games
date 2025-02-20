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
    showWinner: boolean;
}

export class PlayerBankerResultComponent extends React.PureComponent<PlayerBankerResultProps, PlayerBankerResultState> {
    private readonly timeouts: NodeJS.Timeout[] = [];

    constructor(props: PlayerBankerResultProps) {
        super(props);

        this.state = {
            playerScore: 0,
            bankerScore: 0,
            openedCards: 0,
            showWinner: false
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

    private getWinnerText = () => {
        const { playerScore, bankerScore } = this.state;
        const { texts } = this.props;

        if (playerScore > bankerScore) {
            return `${texts.player} WINS!`;
        } else if (bankerScore > playerScore) {
            return `${texts.banker} WINS!`;
        }
        return "TIE";
    }

    private startAnimation = () => {
        if (!this.props.result) return;

        const playerCards = GetPlayerCardsResult(this.props.result);
        const bankerCards = GetBankerCardsResult(this.props.result);

        // Combine and sort cards by animation order
        const allCards = [...playerCards, ...bankerCards]
            .sort((a, b) => a.order - b.order)
            .filter(card => card.value);

        this.timeouts.forEach(clearTimeout);
        this.timeouts.length = 0;

        allCards.forEach((card, index) => {
            console.log(`Setting timeout for card: ${card.value.card}, order: ${card.order}, delay: ${card.animationDelay}, accumulated score: ${card.accumulatedScore}`);
            const timeout = setTimeout(() => {
                this.setState(prevState => {
                    const isBanker = bankerCards.some(bc => bc.value === card.value);
                    const newState = {
                        bankerScore: isBanker ? card.accumulatedScore : prevState.bankerScore,
                        playerScore: !isBanker ? card.accumulatedScore : prevState.playerScore,
                        openedCards: index + 1,
                        showWinner: index === allCards.length - 1
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
        const { openedCards, playerScore, bankerScore, showWinner } = this.state;

        const playerCards = GetPlayerCardsResult(result);
        const bankerCards = GetBankerCardsResult(result);
        const classOpenCards = `opened-cards-${openedCards}`;

        // console.log('playerCards', playerCards);
        // console.log('bankerCards', bankerCards);
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
                                {this.getWinnerText()}
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
} 