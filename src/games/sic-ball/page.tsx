import * as gc from "@sg/sg-game-client";
import { Connection } from "@sg/sg-game-client";
import { handle, observer } from "@sg/sg-observer";
import CountDownTimer from "../../_shared/components/count-down-timer";
import RoundId from "../../_shared/components/round-id";
import GameBase, { IGameBaseState } from "../../_shared/components/game-base";
import { configGameContainer } from "../../_shared/components/game-base/startup";
import type { GameBaseProps } from "../../_shared/components/game-base/type";
import { containerOptions, settingsSicBall, siteConfigs } from "./game-settings";
import { FunctionUtils } from "../../_shared/utils/funtion-utils";
import SicBallBetOptions from "./bet-option/sic-ball-bet-option";
import SicBallRoundHistory from "./round-history";
import SicBallSettlementResult from "./settlement-result/sic-ball-settlement-result";
@observer(settingsSicBall.mainObserverNamespace)
export default class SicBall extends GameBase<GameBaseProps, IGameBaseState> {
    constructor(props: GameBaseProps) {
        super(props);
        configGameContainer(settingsSicBall.name, containerOptions);
    }

    @handle(Connection.ConnectionHandlers.CloseConnectHandler)
    closeConnect() {}

    renderRoundHistory() {
        return <SicBallRoundHistory namespace={this.props.namespace} />;
    }

    renderRoundIdSection() {
        return <RoundId namespace={this.props.namespace} />;
    }

    renderCountDownTimer() {
        return <CountDownTimer namespace={this.props.namespace} />;
    }

    renderBettingBlock() {
        return <SicBallBetOptions namespace={this.props.namespace} />;
    }

    renderResultBlock() {
        return <SicBallSettlementResult namespace={this.props.namespace} />;
    }

    async showResult(
        hasAnimation: boolean,
        result?: gc.GameServiceMessage.TResult,
        settlementResult?: gc.GameServiceMessage.TSettlementResult
    ) {
        //implement animation
        await FunctionUtils.delay(1000);
    }
}
