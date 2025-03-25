import * as gc from '@sg/sg-game-client';
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds';
import { handle, observer, render } from '@sg/sg-observer';

import { IGameBaseState } from '../../../_shared/components/game-base';
import GatewayGameBase from '../../../_shared/components/game-base/gateway-gamebase';
import { configGameContainer } from '../../../_shared/components/game-base/startup';
import { GameBettingOptionsContext } from '../../../_shared/react-contexts/game-betting-zone-context/game-betting-zone-context';
import { FunctionUtils } from '../../../_shared/utils/funtion-utils';
import SeDieRoundHistory from '../sedie/round-history';
import Styles from '../sedie/sedie.module.scss';
import SeDieSettlementResult from '../sedie/settlement-result';
import { SedieStatistic } from '../sedie/statistic';
import VIPSeDieBetOptions from './bet-option/vip-sedie-bet-options';
import { containerOptions, setting } from './game-settings';

@observer(setting.mainObserverNamespace)
export default class VipSeDie extends GatewayGameBase<{ namespace: string; language: string }, IGameBaseState> {
    override overrideClasses = {
        blockWrapper: Styles['block-wrapper'],
        betOptions: Styles['bet-options-block'],
        info: Styles['info-block'],
        result: Styles['result-block'],
    };

    constructor(props: { namespace: string; language: string }) {
        super(props);
        configGameContainer(setting.name, containerOptions);
        this.state = {
            ...this.state,
            gameId: setting.id,
        };
    }

    @handle(gc.Connection.ConnectionHandlers.CloseConnectHandler, (handler) => handler.handleGateway())
    closeConnect() {}

    renderRoundHistory() {
        return <SeDieRoundHistory namespace={this.props.namespace} language={this.props.language} />;
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
                <VIPSeDieBetOptions
                    gameName={setting.gameName}
                    namespace={this.props.namespace}
                    language={this.props.language}
                    onBet={this.handleBetOption}
                />
            </GameBettingOptionsContext.Provider>
        );
    }

    renderResultBlock() {
        return <SeDieSettlementResult namespace={this.props.namespace} />;
    }

    renderStatistic() {
        return <SedieStatistic namespace={this.props.namespace} gameName={setting.gameName} language={this.props.language} />;
    }

    async showResult(
        hasAnimation: boolean,
        result?: gc.GameServiceMessage.TResult,
        settlementResult?: gc.GameServiceMessage.TSettlementResult,
    ) {
        await FunctionUtils.delay(2000);
    }
}
