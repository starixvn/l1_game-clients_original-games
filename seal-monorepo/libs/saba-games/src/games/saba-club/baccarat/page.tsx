import * as gc from "@sg/sg-game-client";
import { handle, observer, render } from "@sg/sg-observer";
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
import { BaccaratStatistic } from "./statistic/baccarat-statistics";
import { containerOptions, setting } from "./game-settings";
import Header from "./header";
import Styles from "./baccarat.module.scss";
import { IBaccaratBet } from "./type";
import { ROUND_STATE } from "@sg/sg-game-client/dist/game/rounds";

interface IBaccaratState extends IGameBaseState {
    previousWinningBet?: IBaccaratBet['type'];
    roundState: string;
    isExpanded: boolean;
}

@observer(setting.mainObserverNamespace)
export default class Baccarat extends GatewayGameBase<GameBaseProps, IBaccaratState> {
    override overrideClasses = {
        blockWrapper: Styles["block-wrapper"]
    }

    constructor(props: GameBaseProps) {
        super(props);
        this.state = {
            ...this.state,
            previousWinningBet: undefined,
            isExpanded: false
        };

        try {
            configGameContainer(setting.name, containerOptions);
        } catch (error) {
            // Silent fail on initialization error
        }
    }

    handleToggleExpand = () => {
        this.setState({ isExpanded: !this.state.isExpanded });
    };

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
        return <RoundId namespace={this.props.namespace} language={gc.Translator.getCurrentLanguageId()} />;
    }

    renderCountDownTimer() {
        return <CountDownTimer namespace={this.props.namespace} />;
    }

    renderBettingBlock() {
        return <BaccaratBetOptions
            namespace={this.props.namespace}
            previousWinningBet={this.state.previousWinningBet}
            roundState={this.state.roundState}
            language={gc.Translator.getCurrentLanguageId()}
            gameName={setting.gameName}
        />;
    }

    renderResultBlock() {
        return <BaccaratSettlementResult namespace={this.props.namespace} />;
    }

    renderStatistic() {
        return <BaccaratStatistic namespace={this.props.namespace} gameName={setting.gameName} />;
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
        if (!result) return;

        // Update the previous winning bet based on the settlement result
        if (settlementResult && this.state.roundState == ROUND_STATE.LOCKING_BET) {
            const winningBet = Object.entries(settlementResult).find(([_, value]) => Number(value) > 0)?.[0] as IBaccaratBet['type'];
            this.setState({ previousWinningBet: winningBet });
        }

        await FunctionUtils.delay(2000);
    }
} 