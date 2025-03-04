import * as gc from "@sg/sg-game-client";
import { handle, observer, render } from "@sg/sg-observer";
import CountDownTimer from "../../../_shared/components/count-down-timer";
import { IGameBaseState } from "../../../_shared/components/game-base";
import GatewayGameBase from "../../../_shared/components/game-base/gateway-gamebase";
import { configGameContainer } from "../../../_shared/components/game-base/startup";
import type { GameBaseProps } from "../../../_shared/components/game-base/type";
import RoundId from "../../../_shared/components/round-id";
import { FunctionUtils } from "../../../_shared/utils/funtion-utils";
import { containerOptions, setting } from "./game-settings";
import { SedieStatistic } from "../sedie/statistic";
import Header from "./header";
import { BigSmallSettlementResult } from "./settlement-result";
import { BigSmallRoundHistory } from "./round-history";
import { BigSmallBetOptions } from "./bet-option";
import styles from "./bigsmall.module.scss";
import { BigSmallStatistic } from "./statistic";
import { ROUND_STATE } from "@sg/sg-game-client/dist/game/rounds";

interface IBigSmallState extends IGameBaseState {
    roundState: string;
    previousResult: "big" | "small" | undefined;
}

@observer(setting.mainObserverNamespace)
export default class BigSmall extends GatewayGameBase<GameBaseProps, IBigSmallState> {
    override overrideClasses = {
        blockWrapper: styles["block-wrapper"],
    };

    constructor(props: GameBaseProps) {
        super(props);
        this.state = {
            ...this.state,
            previousResult: undefined,
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
        return <BigSmallRoundHistory namespace={this.props.namespace} />;
    }

    renderRoundIdSection() {
        return <RoundId namespace={this.props.namespace} />;
    }

    renderCountDownTimer() {
        return <CountDownTimer namespace={this.props.namespace} />;
    }

    renderBettingBlock() {
        return (
            <BigSmallBetOptions
                namespace={this.props.namespace}
                roundState={this.state.roundState}
                previousResult={this.state.previousResult}
            />
        );
    }

    renderResultBlock() {
        return <BigSmallSettlementResult namespace={this.props.namespace} />;
    }

    renderStatistic() {
        return <BigSmallStatistic namespace={this.props.namespace} gameName={setting.gameName} />;
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundState)
    renderCountDownTimerState(roundState: string) {
        this.setState({ roundState });
    }

    async showResult(
        hasAnimation: boolean,
        result?: gc.GameServiceMessage.TResult,
        settlementResult?: gc.GameServiceMessage.TSettlementResult
    ) {
        if (!this.isValidResult(result, settlementResult)) {
            return;
        }

        if (settlementResult && this.state.roundState !== ROUND_STATE.LOCKING_BET) {
            const result = settlementResult.big ? "big" : "small";
            this.setState({ previousResult: result });
        }

        await FunctionUtils.delay(2000);
        this.finishShowResult();
    }
}
