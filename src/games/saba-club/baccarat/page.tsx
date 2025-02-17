import * as gc from "@sg/sg-game-client";
import { handle, observer } from "@sg/sg-observer";
import CountDownTimer from "../../../_shared/components/count-down-timer";
import { IGameBaseState } from "../../../_shared/components/game-base";
import GatewayGameBase from "../../../_shared/components/game-base/gateway-gamebase";
import { configGameContainer } from "../../../_shared/components/game-base/startup";
import type { GameBaseProps } from "../../../_shared/components/game-base/type";
import RoundId from "../../../_shared/components/round-id";
import { FunctionUtils } from "../../../_shared/utils/funtion-utils";
import BaccaratBetOptions from "./bet-option/baccarat-bet-options";
import BaccaratRoundHistory from "./round-history/baccarat-round-history";
import BaccaratSettlementResult from "./settlement-result/baccarat-settlement-result";
import BaccaratStatistics from "./statistic/baccarat-statistics";
import BaccaratScoreboard from "./scoreboard/baccarat-scoreboard";
import { containerOptions, setting } from "./game-settings";
import Header from "./header";

@observer(setting.mainObserverNamespace)
export default class Baccarat extends GatewayGameBase<GameBaseProps, IGameBaseState> {
    constructor(props: GameBaseProps) {
        super(props);
        this.state = {
            ...this.state
        };

        try {
            configGameContainer(setting.name, containerOptions);
        } catch (error) {
            // Silent fail on initialization error
        }
    }

    @handle(gc.Connection.ConnectionHandlers.CloseConnectHandler, (handler) => handler.handleGateway())
    closeConnect() {
    }

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
        return <BaccaratRoundHistory namespace={this.props.namespace} />;
    }

    renderRoundIdSection() {
        return <RoundId namespace={this.props.namespace} />;
    }

    renderCountDownTimer() {
        return <CountDownTimer namespace={this.props.namespace} />;
    }

    renderBettingBlock() {
        return <BaccaratBetOptions namespace={this.props.namespace} />;
    }

    renderResultBlock() {
        return <BaccaratSettlementResult namespace={this.props.namespace} />;
    }

    renderStatistic() {
        return (
            <>
                <BaccaratStatistics namespace={this.props.namespace} />
                {this.renderScoreboard()}
            </>
        );
    }

    renderScoreboard() {
        return <BaccaratScoreboard namespace={this.props.namespace} />;
    }

    async showResult(
        hasAnimation: boolean,
        result?: gc.GameServiceMessage.TResult,
        settlementResult?: gc.GameServiceMessage.TSettlementResult
    ) {
        if (!result) return;
        await FunctionUtils.delay(2000);
    }
} 