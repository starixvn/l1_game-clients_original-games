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
import styles from "./baccarat.module.scss";

interface IBaccaratState extends IGameBaseState {
    isExpanded: boolean;
}

@observer(setting.mainObserverNamespace)
export default class Baccarat extends GatewayGameBase<GameBaseProps, IBaccaratState> {
    constructor(props: GameBaseProps) {
        super(props);
        this.state = {
            ...this.state,
            isExpanded: true
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

    handleToggleExpand = () => {
        this.setState({ isExpanded: !this.state.isExpanded });
    };

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
            <div className={styles['side-content']}>
                <BaccaratStatistics namespace={this.props.namespace} />
                <BaccaratScoreboard namespace={this.props.namespace} />
            </div>
        );
    }

    override render() {
        return (
            <div className={styles['baccarat-container']}>
                {this.renderHeader()}
                <div className={styles['main-content']}>
                    <div className={styles['game-area']}>
                        <div className={styles['game-info']}>
                            {this.renderRoundIdSection()}
                            {this.renderCountDownTimer()}
                        </div>
                        <div className={styles['game-table']}>
                            <div className={styles['player-area']}>
                                <div className={styles['area-label']}>PLAYER</div>
                                <div className={styles['cards-container']}>
                                    {this.renderResultBlock()}
                                </div>
                            </div>
                            <div className={styles['banker-area']}>
                                <div className={styles['area-label']}>BANKER</div>
                                <div className={styles['cards-container']}>
                                    {/* Banker cards will be rendered by settlement result */}
                                </div>
                            </div>
                        </div>
                        <div className={styles['betting-area']}>
                            {this.renderBettingBlock()}
                        </div>
                        <div className={styles['history-area']}>
                            {this.renderRoundHistory()}
                        </div>
                    </div>
                    {this.state.isExpanded && this.renderStatistic()}
                </div>
            </div>
        );
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