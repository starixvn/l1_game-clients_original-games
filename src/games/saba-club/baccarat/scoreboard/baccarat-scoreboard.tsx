import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import Styles from "./baccarat-scoreboard.module.scss";
import { BigRoadScoreboard } from "sc-scoreboards";
import { createRef } from "react";
import React from "react";
import { ROUND_STATE } from "@sg/sg-game-client/dist/game/rounds";
import { ScoreboardItemContent } from "../../../../_shared/components/scoreboard/types";
import { ScoreBoard } from "../../../../_shared/components/scoreboard";
import { BaccaratSettlementResult } from "../type";
import { BaccaratRoadConverter } from "./baccarat-road-converter";
import { BaccaratBetPercentages } from "../baccarat-bet-percentages";

export interface IBaccaratScoreboardState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
    roundState: string;
}

type Props = IPropsObserver & {
    gameName?: string;
};

export class BaccaratScoreboard extends ObserverComponent<Props, IBaccaratScoreboardState> {
    private scrollDivRef = createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);
        this.scrollDivRef = React.createRef();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.rounds !== this.state.rounds) {
            this.scrollToRight();
        }
    }

    scrollToRight = () => {
        if (this.scrollDivRef.current) {
            this.scrollDivRef.current.scrollLeft = this.scrollDivRef.current.scrollWidth;
        }
    };

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(rounds: gc.RoundHistories.RoundHistory[]) {
        this.setState({ rounds });
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundState)
    renderCountDownTimerState(roundState: string) {
        this.setState({ roundState });
    }

    private getSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult): BaccaratSettlementResult {
        const result: BaccaratSettlementResult = {
            winner: 'player',
            playerPair: false,
            bankerPair: false,
            player: false,
            banker: false,
            tie: false,
            big: false,
            small: false
        };

        if (settlementResult && typeof settlementResult === "object") {
            result.player = !!settlementResult.player;
            result.banker = !!settlementResult.banker;
            result.tie = !!settlementResult.tie;

            if (settlementResult.player) {
                result.winner = 'player';
            } else if (settlementResult.banker) {
                result.winner = 'banker';
            } else if (settlementResult.tie) {
                result.winner = 'tie';
            }

            const gameData = settlementResult.gameData;
            if (gameData && typeof gameData === "object") {
                const data = gameData as Record<string, unknown>;
                result.playerPair = !!data.playerPair;
                result.bankerPair = !!data.bankerPair;
                result.big = !!data.big;
                result.small = !!data.small;
            }
        }

        return result;
    }

    render() {
        const { rounds, roundState } = this.state;

        if (!rounds || rounds.length === 0) {
            return <></>;
        }

        const bigRoad = new BigRoadScoreboard({ converter: BaccaratRoadConverter.instance, height: 6 });
        const settlements = rounds.map((round) => {
            return this.getSettlementResult(round.settlementResult);
        });
        const input = [...settlements].reverse();

        const hasBlink = roundState === ROUND_STATE.LOCKING_BET || roundState === ROUND_STATE.SHOW_ANIMATION_RESULT;
        bigRoad.initialize(input, hasBlink);
        const rows = bigRoad.rows();

        const scoreboardCharacter: ScoreboardItemContent = {
            positiveItemContent: "P",
            negativeItemContent: "B"
        };

        const scoreboardDotClassName: ScoreboardItemContent = {
            positiveItemContent: "dot-player",
            negativeItemContent: "dot-banker"
        };

        const imageConfig = {
            positiveImage: '/static/images/baccarat/scoreboard/big-road/player.png',
            negativeImage: '/static/images/baccarat/scoreboard/big-road/banker.png',
            blinkImage: '/static/images/baccarat/scoreboard/big-road/Rectangle 9391.png'
        };

        return (
            <div className={Styles.scoreboard}>
                <div className={Styles["scoreboard-title"]}>Scoreboard</div>
                <div className={Styles["scoreboard-percentage"]}>
                    <div className={Styles["split-percentage"]}>
                        <BaccaratBetPercentages
                            gameName={this.props.gameName}
                            settlements={settlements}
                            rounds={rounds}
                        />
                    </div>
                </div>
                <div className={`${Styles["scoreboard-content"]} baccarat-scoreboard`} ref={this.scrollDivRef}>
                    <ScoreBoard
                        gameName={this.props.gameName}
                        rows={rows}
                        scoreboardCharacter={scoreboardCharacter}
                        scoreboardDotClassName={scoreboardDotClassName}
                        useImages={true}
                        imageConfig={imageConfig}
                    />
                </div>
            </div>
        );
    }
} 