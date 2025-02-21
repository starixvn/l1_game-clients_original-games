import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import Styles from "./baccarat-scoreboard.module.scss";
import { BigRoadScoreboard } from "sc-scoreboards";
import { createRef } from "react";
import React from "react";
import { ROUND_STATE } from "@sg/sg-game-client/dist/game/rounds";
import { ScoreboardItemContent } from "../../../../_shared/components/scoreboard/types";
import { BetPercentages } from "../../../../_shared/components/bet-percentages";
import { ScoreBoard } from "../../../../_shared/components/scoreboard";
import { BaccaratSettlementResult } from "../type";
import { BaccaratRoadConverter } from "./baccarat-road-converter";

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
            bankerPair: false
        };

        if (settlementResult && typeof settlementResult === "object") {
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

        return (
            <div className={Styles.scoreboard}>
                <div className={Styles["scoreboard-title"]}>Baccarat Scoreboard</div>
                <div className={Styles["scoreboard-percentage"]}>
                    {/* <div className={Styles["player-percentage"]}>
                        Player
                    </div> */}
                    <div className={Styles["split-percentage"]}>
                        <BetPercentages
                            gameName={this.props.gameName}
                            scoreboardCharacter={scoreboardCharacter}
                            settlements={settlements}
                        />
                    </div>
                    {/* <div className={Styles["banker-percentage"]}>
                        Banker
                    </div> */}
                </div>
                <div className={`${Styles["scoreboard-content"]} baccarat-scoreboard`} ref={this.scrollDivRef}>
                    <ScoreBoard
                        gameName={this.props.gameName}
                        rows={rows}
                        scoreboardCharacter={scoreboardCharacter}
                        scoreboardDotClassName={scoreboardDotClassName}
                    />
                </div>
            </div>
        );
    }
} 