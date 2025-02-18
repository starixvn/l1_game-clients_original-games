import React from "react";
import { Result } from "../../baccarat";
import { GetBankerCardsResult, GetPlayerCardsResult } from "../../baccarat-helper";
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
        if (!this.props.playResultAnimation && prevProps.result !== this.props.result) {
            this.updateScorePlayerBanker();
        }
    }

    private startAnimation = () => {
        const { result } = this.props;
        const cardOpenedTimes = [
            { t: 700, c: result.player.card1, isBanker: false },
            { t: 1500, c: result.banker.card1, isBanker: true },
            { t: 2300, c: result.player.card2, isBanker: false },
            { t: 3100, c: result.banker.card2, isBanker: true },
            { t: 4400, c: result.player.card3 ?? result.banker.card3, isBanker: !result.player.card3 },
            { t: 5800, c: result.player.card3 ? result.banker.card3 : null, isBanker: true },
        ];

        cardOpenedTimes
            .filter((ct) => !!ct.c)
            .forEach((ct, i) => {
                const timeout = setTimeout(() => {
                    this.setState(prevState => ({
                        bankerScore: ct.isBanker ? sumScore(prevState.bankerScore, ct.c.card) : prevState.bankerScore,
                        playerScore: !ct.isBanker ? sumScore(prevState.playerScore, ct.c.card) : prevState.playerScore,
                        openedCards: i + 1,
                    }));
                }, ct.t);
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
        const { playResultAnimation, result, texts } = this.props;
        const { openedCards, playerScore, bankerScore } = this.state;

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
                    />
                    <CardSection
                        cards={bankerCards}
                        label={texts.banker}
                        score={bankerScore}
                        type="banker"
                        playResultAnimation={playResultAnimation}
                    />
                </div>
            </div>
        );
    }
} 