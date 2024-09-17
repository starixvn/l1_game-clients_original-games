import { FC, memo } from "react";
import { TurnBaseResultSlotContainer } from "../../_shared/components/turn-base-result-container/turn-base-result-container";
import Style from "./lucky-next-ball.module.scss";
import { NextBallResult } from "./type";
import { TURN_ROUND_STATE, RoundTimeStore } from "@sg/sg-game-client/dist/game-turn-base/rounds";
import { BallStatus } from "../../_shared/components/ball";

const defaultRoundData = [
    { number: 0, status: BallStatus.NONE, delayTime: 0 },
    { number: 0, status: BallStatus.NONE, delayTime: 0 },
    { number: 0, status: BallStatus.NONE, delayTime: 0 },
    { number: 0, status: BallStatus.NONE, delayTime: 0 },
    { number: 0, status: BallStatus.NONE, delayTime: 0 },
    { number: 0, status: BallStatus.NONE, delayTime: 0 },
    { number: 0, status: BallStatus.NONE, delayTime: 0 },
    { number: 0, status: BallStatus.NONE, delayTime: 0 },
];

const NextBallResultBlock: FC<{}> = () => {
    // const { result, roundState, roundHistory, playResultAnimation, isPlayStartRoundAnimation } = props;

    // if (roundState === TURN_ROUND_STATE.SWITCH_ROUND && !isPlayStartRoundAnimation) {
    //     return <></>;
    // }
    return <></>;
    // return (
    //     <div
    //         className={`${Style["result-container"]} ${roundState === TURN_ROUND_STATE.SWITCH_ROUND && isPlayStartRoundAnimation ? "showResultContainer" : ""
    //             }`}
    //     >
    //         <div className={Style["result"]}>
    //             <TurnBaseResultSlotContainer
    //                 defaultRoundData={defaultRoundData}
    //                 delayTime={0}
    //                 betChoice={""}
    //                 className="balls"
    //                 betChoiceBalls="balls"
    //                 {...props}
    //             />
    //         </div>
    //     </div>
    // );
};

export default memo(NextBallResultBlock);
