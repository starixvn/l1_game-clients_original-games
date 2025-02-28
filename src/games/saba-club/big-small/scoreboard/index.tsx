import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import Styles from "./scoreboard.module.scss";
import { RoundDot } from "../../../../_shared/components/dot";
import { BigRoadScoreboard, Converter } from "sc-scoreboards";
import { createRef } from "react";
import React from "react";
import { ROUND_STATE } from "@sg/sg-game-client/dist/game/rounds";
import { ScoreboardItemContent } from "../../../../_shared/components/scoreboard/types";
import { choices } from "../../../../_shared/types/settlement-result";
import { BetPercentages } from "../../../../_shared/components/bet-percentages";
import { OddEvenBigRoadConverter, ScoreBoard } from "../../../../_shared/components/scoreboard";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import { BigSmallSettlementResult } from "../type";
import { BigSmallBigRoadConverter } from "../../../../_shared/components/scoreboard/converters";



export interface IBigSmallResultHistoryState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
    roundState: string;
}

type Props = IPropsObserver & {
    gameName?: string;
};


export class BigSmallScoreBoard extends ObserverComponent<Props, IBigSmallResultHistoryState> {
    private scrollDivRef = createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);

        this.scrollDivRef = React.createRef();
    }

    componentDidUpdate(prevProps, prevState) {
        // Scroll to right if items have changed
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

    render() {
        const { rounds, roundState } = this.state;

        if (!rounds || rounds.length === 0) {
            return <></>;
        }

        const bigRoad = new BigRoadScoreboard({ converter: BigSmallBigRoadConverter.instance, height: 6 });

        const settlements = rounds.map((round) => {
            return round.settlementResult as unknown as BigSmallSettlementResult;
        });
        const input = [...settlements].reverse();

        const hasBlink = roundState === ROUND_STATE.LOCKING_BET || roundState === ROUND_STATE.SHOW_ANIMATION_RESULT;
        bigRoad.initialize(input, hasBlink);
        const rows = bigRoad.rows();

        const scoreboardCharacter: ScoreboardItemContent = {
            positiveItemContent: `${choices.big}`,
            negativeItemContent: `${choices.small}`,
        };

        const scoreboardDotClassName: ScoreboardItemContent = {
            positiveItemContent: "dot-big",
            negativeItemContent: `dot-small`,
        };

        return (
            <div className={Styles["scoreboard"]}>
                <div className={Styles["scoreboard-title"]}>Big Small Scoreboard</div>
                {<BetPercentages gameName={this.props.gameName} scoreboardCharacter={scoreboardCharacter} settlements={settlements} />}

                <div className={Styles["scoreboard-content"]} ref={this.scrollDivRef}>
                    {
                        <ScoreBoard
                            gameName={this.props.gameName}
                            rows={rows}
                            scoreboardCharacter={scoreboardCharacter}
                            scoreboardDotClassName={scoreboardDotClassName}
                        />
                    }
                </div>
            </div>
        );
    }
}
