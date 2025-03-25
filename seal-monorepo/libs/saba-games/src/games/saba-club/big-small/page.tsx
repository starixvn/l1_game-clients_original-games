import * as gc from '@sg/sg-game-client';
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds';
import { handle, observer, render } from '@sg/sg-observer';
import { IGameBaseState } from '../../../_shared/components/game-base';
import GatewayGameBase from '../../../_shared/components/game-base/gateway-gamebase';
import { configGameContainer } from '../../../_shared/components/game-base/startup';
import type { GameBaseProps } from '../../../_shared/components/game-base/type';
import { GameBettingOptionsContext } from '../../../_shared/react-contexts/game-betting-zone-context/game-betting-zone-context';
import { FunctionUtils } from '../../../_shared/utils/funtion-utils';
import { BigSmallBetOptions } from './bet-option';
import styles from './big-small.module.scss';
import { containerOptions, setting } from './game-settings';
import { BigSmallRoundHistory } from './round-history';
import { BigSmallSettlementResult } from './settlement-result';
import { BigSmallStatistic } from './statistic';

interface IBigSmallPageState extends IGameBaseState {
    activePanelId: any;
    showBetPanel: boolean;
    gameId: number;
}

interface IBigSmallPageProps extends GameBaseProps {
    language: string;
}

@observer(setting.mainObserverNamespace)
export default class BigSmallPage extends GatewayGameBase<IBigSmallPageProps, IBigSmallPageState> {
    override overrideClasses = {
        blockWrapper: styles['block-wrapper'],
        info: styles['info'],
        result: styles['result'],
        betOptions: styles['bet-options'],
    };

    constructor(props: IBigSmallPageProps) {
        super(props);
        try {
            configGameContainer(setting.name, containerOptions);
        } catch (error) {
            // Silent fail on initialization error
        }

        this.state = {
            ...this.state,
            gameId: setting.id,
        };
    }

    @handle(gc.Connection.ConnectionHandlers.CloseConnectHandler, (handler) => handler.handleGateway())
    closeConnect() {}

    renderRoundHistory() {
        return <BigSmallRoundHistory namespace={this.props.namespace} language={this.props.language} />;
    }

    renderBettingBlock() {
        return (
            <GameBettingOptionsContext.Provider
                value={{
                    panelId: this.state.activePanelId,
                    setPanelId: this.setPanelId,
                    show: this.state.showBetPanel,
                    setShow: this.setShowBetPanel,
                }}
            >
                <BigSmallBetOptions
                    gameName={setting.gameName}
                    namespace={this.props.namespace}
                    language={this.props.language}
                    onBet={this.handleBetOption}
                />
            </GameBettingOptionsContext.Provider>
        );
    }

    renderResultBlock() {
        return <BigSmallSettlementResult namespace={this.props.namespace} language={this.props.language} />;
    }

    renderStatistic() {
        return <BigSmallStatistic namespace={this.props.namespace} gameName={setting.gameName} language={this.props.language} />;
    }

    // @render(gc.Rounds.RoundTimeStore, (store) => store.roundState)
    // renderCountDownTimerState(roundState: string) {
    //     this.setState({ roundState });
    // }

    async showResult(
        hasAnimation: boolean,
        result?: gc.GameServiceMessage.TResult,
        settlementResult?: gc.GameServiceMessage.TSettlementResult,
    ) {
        if (!this.isValidResult(result, settlementResult)) {
            return;
        }

        await FunctionUtils.delay(2000);
        this.finishShowResult();
    }
}
