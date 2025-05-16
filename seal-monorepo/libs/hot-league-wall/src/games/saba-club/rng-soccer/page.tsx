import React, { Suspense } from 'react';
import * as gc from '@sg/sg-game-client';
import { handle, observer, render } from '@sg/sg-observer';
import GatewayGameBase, { IGatewayGameBaseState } from '../../../_shared/components/game-base/gateway-gamebase';
import { configGameContainer } from '../../../_shared/components/game-base/startup';
import type { GameBaseProps } from '../../../_shared/components/game-base/type';
import { GameBettingOptionsContext } from '../../../_shared/react-contexts/game-betting-zone-context/game-betting-zone-context';
import { FunctionUtils } from '../../../_shared/utils/funtion-utils';
import styles from './rng-soccer.module.scss';
import { containerOptions, setting } from './game-settings';
import RNGSoccerSettlementResult from './settlement-result';
import { ANIMATION_DURATION_MS } from './constants/rng-soccer-constants';
import RNGSoccerBetOptions from './bet-option/rng-soccer-bet-options';
import { RNGSoccerResult, RNGSoccerSettlementResult as RNGSoccerSettlementResultType } from './type';

const RNGSoccerStatistic = React.lazy(() => import('./statistic/rng-soccer-statistic'));
const RNGSoccerRoundHistory = React.lazy(() => import('./round-history/rng-soccer-round-history'));

interface IRNGSoccerPageState extends IGatewayGameBaseState {
    activePanelId: any;
    roundState: string;
    showBetPanel: boolean;
    gameId: number;
}

@observer(setting.mainObserverNamespace)
export default class RNGSoccerPage extends GatewayGameBase<GameBaseProps, IRNGSoccerPageState> {
    override overrideClasses = {
        blockWrapper: styles['block-wrapper'],
        betOptions: styles['bet-options-block'],
        info: styles['info-block'],
        result: styles['result-block'],
    };

    state = {
        ...this.state,
        gameId: setting.id,
        isHeaderExpanded: true
    };

    constructor(props: GameBaseProps) {
        super(props);
        try {
            configGameContainer(setting.name, containerOptions);
        } catch (error) {
            // Silent fail on initialization error
        }
    }

    toggleHeader = () => {
        this.setState({
            ...this.state,
            isHeaderExpanded: !this.state.isHeaderExpanded
        });
    }

    @handle(gc.Connection.ConnectionHandlers.CloseConnectHandler, (handler) => handler.handleGateway())
    closeConnect() { }

    async showResult(hasAnimation: boolean, result?: RNGSoccerResult, settlementResult?: RNGSoccerSettlementResultType): Promise<void> {
        // Implement show result logic
        return Promise.resolve();
    }

    renderRoundHistory() {
        return (
            <Suspense>
                <RNGSoccerRoundHistory namespace={this.props.namespace} language={this.props.language} />
            </Suspense>
        );
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
                <RNGSoccerBetOptions
                    gameName={setting.gameName}
                    namespace={this.props.namespace}
                    language={this.props.language}
                    onBet={this.handleBetOption}
                />
            </GameBettingOptionsContext.Provider>
        );
    }

    renderSettlementResult() {
        return (
            <RNGSoccerSettlementResult
                namespace={this.props.namespace}
                language={this.props.language}
            />
        );
    }

    renderStatistic() {
        return (
            <Suspense>
                <RNGSoccerStatistic namespace={this.props.namespace} language={this.props.language} />
            </Suspense>
        );
    }
} 