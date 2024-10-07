import * as gc from "@sg/sg-game-client";
import { Connection } from "@sg/sg-game-client";
import { handle, observer } from "@sg/sg-observer";
import CountDownTimer from "../../../_shared/components/count-down-timer";
import RoundId from "../../../_shared/components/round-id";
import GameBase, { IGameBaseState } from "../../../_shared/components/game-base";
import { configGameContainer } from "../../../_shared/components/game-base/startup";
import type { GameBaseProps } from "../../../_shared/components/game-base/type";
import { containerOptions, setting, siteConfigs } from "./game-settings";
import SeDieRoundHistory from "./round-history";
import SeDieBetOptions from "./bet-option/sedie-bet-options";
import SeDieSettlementResult from "./settlement-result";
import { FunctionUtils } from "../../../_shared/utils/funtion-utils";
import { SedieStatistic } from "./statistic";

@observer(setting.mainObserverNamespace)
export default class SeDie extends GameBase<GameBaseProps, IGameBaseState> {
    constructor(props: GameBaseProps) {
        super(props);
        configGameContainer(setting.name, containerOptions);
    }

    @handle(Connection.ConnectionHandlers.CloseConnectHandler)
    closeConnect() {}

    renderRoundHistory() {
        return <SeDieRoundHistory namespace={this.props.namespace} />;
    }

    renderRoundIdSection() {
        return <RoundId namespace={this.props.namespace} />;
    }

    renderCountDownTimer() {
        return <CountDownTimer namespace={this.props.namespace} />;
    }

    renderBettingBlock() {
        return <SeDieBetOptions namespace={this.props.namespace} />;
    }

    renderResultBlock() {
        return <SeDieSettlementResult namespace={this.props.namespace} />;
    }

    renderStatistic() {
        return <SedieStatistic namespace={this.props.namespace} />;
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
