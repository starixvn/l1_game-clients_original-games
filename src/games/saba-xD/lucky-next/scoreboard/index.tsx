import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import React, { createRef } from "react";
import { Stack } from "react-bootstrap";
import { BigRoadScoreboard } from "sc-scoreboards";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import { hasBlink, OddEvenBigRoadConverter, OverUnderBigRoadConverter, ScoreBoard } from "../../../../_shared/components/scoreboard/";
import { ScoreboardItemContent } from "../../../../_shared/components/scoreboard/types";
import { choices } from "../../../../_shared/types/settlement-result";
import { LuckyNextSettlementResult } from "../type";
import Styles from "./scoreboard.module.scss";
import { BetPercentages } from "../../../../_shared/components/bet-percentages";
import { Translator } from "@sg/sg-game-client";
const numberOfResult = 100;

export interface ILuckyNextScoreboardState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
    isOverUnder: boolean;
    roundState: string;
}
const OVER_UNDER_AS_DEFAULT_SCOREBOARD = true;
type Props = IPropsObserver & {
    gameName?: string;
};

export class LuckyNextScoreBoard extends ObserverComponent<Props, ILuckyNextScoreboardState> {
    private scrollDivRef = createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);
        this.state = {
            rounds: [],
            isOverUnder: true,
        } as ILuckyNextScoreboardState;
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

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundState)
    renderCountDownTimerState(roundState: string) {
        this.setState({ roundState });
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(rounds: gc.RoundHistories.RoundHistory[]) {
        this.setState({ rounds: rounds.slice(0, numberOfResult) });
    }

    render() {
        const { rounds, roundState, isOverUnder } = this.state;
        if (!rounds || rounds.length === 0) {
            return <></>;
        }

        const bigRoad = isOverUnder
            ? new BigRoadScoreboard({ converter: OverUnderBigRoadConverter.instance, height: 6 })
            : new BigRoadScoreboard({ converter: OddEvenBigRoadConverter.instance, height: 6 });

        const settlements = rounds.map((round) => {
            return round.settlementResult as LuckyNextSettlementResult;
        });

        const input = [...settlements].reverse();
        bigRoad.initialize(input, hasBlink(roundState));
        const rows = bigRoad.rows();

        const scoreboardCharacter: ScoreboardItemContent = {
            positiveItemContent: `${isOverUnder ? choices.over : choices.odd}`,
            negativeItemContent: `${isOverUnder ? choices.under : choices.even}`,
        };

        const scoreboardDotClassName: ScoreboardItemContent = {
            positiveItemContent: "dot-over",
            negativeItemContent: `dot-under`,
        };

        const setIsOverUnder = (isOverUnder = OVER_UNDER_AS_DEFAULT_SCOREBOARD) => {
            this.setState({ isOverUnder });
        };
        const translateBetOption = (option) => Translator.t(`${this.props.gameName}.glossary_${option}`);
        return (
            <div className={Styles["scoreboard"]}>
                <div className={Styles["scoreboard-title"]}>Lucky Next Scoreboard</div>
                <Stack direction="horizontal">
                    <button
                        className={`${isOverUnder ? Styles["selected"] : Styles["un-selected"]} ${Styles["bet-group"]}`}
                        onClick={() => setIsOverUnder()}
                    >
                        {translateBetOption(choices.over)}/{translateBetOption(choices.under)}
                    </button>
                    <button
                        className={`${isOverUnder ? Styles["un-selected"] : Styles["selected"]} ${Styles["bet-group"]}`}
                        onClick={() => setIsOverUnder(false)}
                    >
                        {translateBetOption(choices.odd)}/{translateBetOption(choices.even)}
                    </button>
                </Stack>

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
