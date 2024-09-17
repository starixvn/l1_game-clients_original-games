import * as gc from "@sg/sg-game-client";
import { RoundHistoryStore } from "@sg/sg-game-client/dist/game/round-histories";
import { SettlementStore } from "@sg/sg-game-client/dist/game/settlements";
import { render } from "@sg/sg-observer";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../_shared/components/observer-component/observer-component";

import { TURN_ROUND_STATE, RoundTimeStore, RoundStore } from "@sg/sg-game-client/dist/game-turn-base/rounds";
import { BallStatus, IBall } from "../../_shared/components/ball";
import { TurnBaseResultSlotContainer } from "../../_shared/components/turn-base-result-container/turn-base-result-container";
import Style from "./lucky-next.module.scss";

const defaultRoundData: IBall[] = [
    { number: 0, status: BallStatus.NONE, delayTime: 0 },
    { number: 0, status: BallStatus.NONE, delayTime: 0 },
    { number: 0, status: BallStatus.NONE, delayTime: 0 },
    { number: 0, status: BallStatus.NONE, delayTime: 0 },
    { number: 0, status: BallStatus.NONE, delayTime: 0 },
    { number: 0, status: BallStatus.NONE, delayTime: 0 },
    { number: 0, status: BallStatus.NONE, delayTime: 0 },
    { number: 0, status: BallStatus.NONE, delayTime: 0 },
];


export interface ILuckyNextSettlementResultState extends IStateObserver {
    result: gc.GameServiceMessage.TResult;
    roundState: string;
    isAnimationResult: boolean;
    turnCounter: number;
    roundData: any
}

export default class LuckyNextSettlementResult extends ObserverComponent<IPropsObserver, ILuckyNextSettlementResultState> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
            result: {},
            roundState: "",
            isAnimationResult: false,
            turnCounter: 0,
            roundData: null
        };
    }

    @render(RoundTimeStore, (store) => store.roundState)
    handleRoundState(roundState: string) {
        this.setState({ roundState });
    }


    @render(RoundStore, (store) => store.RoundData)
    handleRoundData(roundData: any) {
        this.setState({ roundData });
    }

    @render(SettlementStore, (store) => store.currentFinish, {
        fireImmediately: false,
    })
    renderCurrentFinish(currentFinish: gc.GameServiceMessage.Finish) {
        console.log({ currentFinish })
        if (!currentFinish) {
            return;
        }
        const { result } = currentFinish;

        if (!result) {
            return;
        }

        this.setState({ result, isAnimationResult: true });
    }

    @render(RoundHistoryStore, (store) => store.firstJoinGameHistory)
    handleJoinGameAndShowResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory) {
        if (!firstJoinGameHistory) {
            return;
        }

        const lastRound = firstJoinGameHistory?.roundHistory;
        if (lastRound) {
            this.setState({ result: lastRound?.result });
        }
    }

    render() {
        const { result, roundState, turnCounter, isAnimationResult, roundData } = this.state;

        if (roundState === TURN_ROUND_STATE.SWITCH_ROUND && !isAnimationResult) {
            return <></>;
        }

        return (
            <div
                className={`${Style["result-container"]} ${roundState === TURN_ROUND_STATE.SWITCH_ROUND && isAnimationResult ? "showResultContainer" : ""
                    }`}
            >
                <div className={Style["result"]}>
                    <TurnBaseResultSlotContainer
                        defaultRoundData={defaultRoundData}
                        delayTime={0}
                        betChoice={""}
                        className="balls"
                        betChoiceBalls="balls"
                        roundState={roundState}
                        roundData={roundData}
                        turnCounter={turnCounter}
                        playResultAnimation={isAnimationResult}
                    />
                </div>
            </div>
        );
    }
}
