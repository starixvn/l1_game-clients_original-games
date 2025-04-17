import React, { Suspense } from 'react';
import * as gc from '@sg/sg-game-client';
import { handle, observer } from '@sg/sg-observer';
import GatewayGameBase, { IGatewayGameBaseState } from '../../../_shared/components/game-base/gateway-gamebase';
import { configGameContainer } from '../../../_shared/components/game-base/startup';
import type { GameBaseProps } from '../../../_shared/components/game-base/type';
import { GameBettingOptionsContext } from '../../../_shared/react-contexts/game-betting-zone-context/game-betting-zone-context';
import { FunctionUtils } from '../../../_shared/utils/funtion-utils';
import FishPrawnCrabBetOptions from './bet-option';
import styles from './fish-prawn-crab.module.scss';
import { containerOptions, setting } from './game-settings';
import FishPrawnCrabSettlementResult from './settlement-result';

const FishPrawnCrabStatistic = React.lazy(() => import('./statistic/fish-prawn-crab-statistic'));
const FishPrawnCrabRoundHistory = React.lazy(() => import('./round-history/fish-prawn-crab-round-history'));

interface IFishPrawnCrabPageState extends IGatewayGameBaseState {
    activePanelId: any;
    showBetPanel: boolean;
    gameId: number;
}

interface IFishPrawnCrabPageProps extends GameBaseProps {
    language: string;
}

@observer(setting.mainObserverNamespace)
export default class FishPrawnCrabPage extends GatewayGameBase<IFishPrawnCrabPageProps, IFishPrawnCrabPageState> {
    override overrideClasses = {
        blockWrapper: styles['block-wrapper'],
        betOptions: styles['bet-options-block'],
        info: styles['info-block'],
        result: styles['result-block'],
    };

    constructor(props: IFishPrawnCrabPageProps) {
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
    closeConnect() { }

    renderRoundHistory() {
        return (
            <Suspense>
                <FishPrawnCrabRoundHistory namespace={this.props.namespace} language={this.props.language} />
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
                <FishPrawnCrabBetOptions
                    gameName={setting.gameName}
                    namespace={this.props.namespace}
                    language={this.props.language}
                    onBet={this.handleBetOption}
                />
            </GameBettingOptionsContext.Provider>
        );
    }

    renderResultBlock() {
        return <FishPrawnCrabSettlementResult namespace={this.props.namespace} language={this.props.language} />;
    }

    renderStatistic() {
        return (
            <Suspense>
                <FishPrawnCrabStatistic namespace={this.props.namespace} gameName={setting.gameName} language={this.props.language} />
            </Suspense>
        );
    }

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