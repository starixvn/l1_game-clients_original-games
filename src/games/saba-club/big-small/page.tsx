import * as gc from "@sg/sg-game-client";
import { handle, observer } from "@sg/sg-observer";
import CountDownTimer from "../../../_shared/components/count-down-timer";
import { IGameBaseState } from "../../../_shared/components/game-base";
import GatewayGameBase from "../../../_shared/components/game-base/gateway-gamebase";
import { configGameContainer } from "../../../_shared/components/game-base/startup";
import type { GameBaseProps } from "../../../_shared/components/game-base/type";
import RoundId from "../../../_shared/components/round-id";
import { FunctionUtils } from "../../../_shared/utils/funtion-utils";
import BigSmallBetOptions from "./bet-option/big-small-options";
import { containerOptions, setting } from "./game-settings";
import SeDieRoundHistory from "../sedie/round-history";
import SeDieSettlementResult from "../sedie/settlement-result";
import { SedieStatistic } from "../sedie/statistic";
import Header from "./header";

@observer(setting.mainObserverNamespace)
export default class BigSmall extends GatewayGameBase<GameBaseProps, IGameBaseState> {
    constructor(props: GameBaseProps) {
        super(props);
        this.state = {
            ...this.state,
        };

        try {
            configGameContainer(setting.name, containerOptions);
        } catch (error) {
            // Silent fail on initialization error
        }
    }

    @handle(gc.Connection.ConnectionHandlers.CloseConnectHandler, (handler) => handler.handleGateway())
    closeConnect() {}

    override renderHeader() {
        return (
            <Header
                namespace={this.props.namespace}
                isExpanded={this.state.isExpanded}
                onToggleExpand={this.handleToggleExpand}
                gameId={setting.id}
            />
        );
    }

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
        return <BigSmallBetOptions namespace={this.props.namespace} />;
    }

    renderResultBlock() {
        return <SeDieSettlementResult namespace={this.props.namespace} />;
    }

    renderStatistic() {
        return <SedieStatistic namespace={this.props.namespace} gameName={setting.gameName} />;
    }

    async showResult(
        hasAnimation: boolean,
        result?: gc.GameServiceMessage.TResult,
        settlementResult?: gc.GameServiceMessage.TSettlementResult
    ) {
        if (!this.isValidResult(result, settlementResult)) {
            return;
        }

        await FunctionUtils.delay(1000);
        this.finishShowResult();
    }
}
