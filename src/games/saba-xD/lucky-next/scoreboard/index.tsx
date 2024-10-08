import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import React, { createRef } from "react";
import { Stack } from "react-bootstrap";
import { BigRoadScoreboard } from "sc-scoreboards";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import { hasBlink, OddEvenBigRoadConverter, OverUnderBigRoadConverter, ScoreBoard } from "../../../../_shared/components/scoreboard/";
import { ScoreboardDotContent } from "../../../../_shared/components/scoreboard/types";
import { choices } from "../../../../_shared/types/settlement-result";
import { LuckyNextSettlementResult } from "../type";
import Styles from "./scoreboard.module.scss";
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

        const calPercentage = (settlements: any[], left: string, right: string) => {
            const totalCount = settlements.length;

            const overCount = settlements.filter((entry) => entry[left]).length;
            const underCount = settlements.filter((entry) => entry[right]).length;

            const leftPercentage = totalCount > 0 ? parseFloat(((overCount / totalCount) * 100).toFixed(2)) : 0;
            const rightPercentage = totalCount > 0 ? parseFloat(((underCount / totalCount) * 100).toFixed(2)) : 0;

            return {
                left: leftPercentage,
                right: rightPercentage,
            };
        };
        const percentagesOverUnder = calPercentage(settlements, choices.over, choices.under);
        const percentagesOddEven = calPercentage(settlements, choices.odd, choices.even);
        const renderPercentageOddEven = () => (
            <div className={Styles["scoreboard-percentage"]}>
                <div className={Styles["left-percentage"]}>{`Odd ${percentagesOddEven.left}%`}</div>
                <div className={Styles["split-percentage"]}>|</div>
                <div className={Styles["right-percentage"]}>{`Even ${percentagesOddEven.right}%`}</div>
            </div>
        );

        const renderPercentageOverUnder = () => (
            <div className={Styles["scoreboard-percentage"]}>
                <div className={Styles["left-percentage"]}>{`Over ${percentagesOverUnder.left}%`}</div>
                <div className={Styles["split-percentage"]}>|</div>
                <div className={Styles["right-percentage"]}>{`Under ${percentagesOverUnder.right}%`}</div>
            </div>
        );
        const setIsOverUnder = (isOverUnder = OVER_UNDER_AS_DEFAULT_SCOREBOARD) => {
            this.setState({ isOverUnder });
        };
        const scoreboardCharacterContent: ScoreboardDotContent = {
            positiveDotContent: `${isOverUnder ? choices.over : choices.odd}`,
            negativeDotContent: `${isOverUnder ? choices.under : choices.even}`,
        };
        const scoreboardDotClassName: ScoreboardDotContent = {
            positiveDotContent: "dot-over",
            negativeDotContent: `dot-under`,
        };

        return (
            <div className={Styles["scoreboard"]}>
                <div className={Styles["scoreboard-title"]}>LuckyNext Scoreboard</div>
                <Stack direction="horizontal">
                    <button onClick={() => setIsOverUnder()}>Over/Under</button>
                    <button onClick={() => setIsOverUnder(false)}>Odd/Even</button>
                </Stack>

                {isOverUnder ? renderPercentageOverUnder() : renderPercentageOddEven()}
                <div className={Styles["scoreboard-content"]} ref={this.scrollDivRef}>
                    {
                        <ScoreBoard
                            gameName={this.props.gameName}
                            rows={rows}
                            scoreboardCharacter={scoreboardCharacterContent}
                            scoreboardDotClassName={scoreboardDotClassName}
                        />
                    }
                </div>
            </div>
        );
    }
}
