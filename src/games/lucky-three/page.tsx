import * as gc from "@sg/sg-game-client";
import { Connection } from "@sg/sg-game-client";
import { handle, observer } from "@sg/sg-observer";
import CountDownTimer from "../../_shared/components/count-down-timer";
import RoundId from "../../_shared/components/round-id";
import GameBase, { IGameBaseState } from "../../_shared/components/game-base";
import { configGameContainer } from "../../_shared/components/game-base/startup";
import type { GameBaseProps } from "../../_shared/components/game-base/type";
import { containerOptions, settingsLuckyNext, siteConfigs } from "./game-settings";
import { FunctionUtils } from "../../_shared/utils/funtion-utils";
import TurnCounter from "../../_shared/components/turn-counter";

configGameContainer(settingsLuckyNext.name, containerOptions, siteConfigs);
@observer(settingsLuckyNext.mainObserverNamespace)
export default class LuckyNext extends GameBase<GameBaseProps, IGameBaseState> {
    @handle(Connection.ConnectionHandlers.CloseConnectHandler)
    closeConnect() { }

    renderStatistic() {
        return <>   </>;
    }

    renderRoundIdSection() {
        return <RoundId namespace={this.props.namespace} />;
    }

    renderCountDownTimer() {
        return <CountDownTimer namespace={this.props.namespace} />;
    }

    renderBettingBlock() {
        return <>   </>;
        // return <SeDieBetOptions namespace={this.props.namespace} />;
    }

    renderResultBlock() {
        return <>   </>;
        // return <SeDieSettlementResult namespace={this.props.namespace} />;
    }

    renderTurnCounterSection(): JSX.Element {
        return <TurnCounter namespace={this.props.namespace} />;
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
