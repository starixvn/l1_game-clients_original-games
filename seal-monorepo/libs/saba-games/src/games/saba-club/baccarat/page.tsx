import * as gc from '@sg/sg-game-client';
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds';
import { handle, observer, render } from '@sg/sg-observer';

import CountDownTimer from '../../../_shared/components/count-down-timer';
import { IGameBaseState } from '../../../_shared/components/game-base';
import GatewayGameBase from '../../../_shared/components/game-base/gateway-gamebase';
import { configGameContainer } from '../../../_shared/components/game-base/startup';
import RoundId from '../../../_shared/components/round-id';
import { FunctionUtils } from '../../../_shared/utils/funtion-utils';
import Styles from './baccarat.module.scss';
import BaccaratBetOptions from './bet-option/baccarat-bet-options';
import { containerOptions, setting } from './game-settings';
import BaccaratRoundHistory from './round-history/baccarat-round-history';
import BaccaratSettlementResult from './settlement-result/baccarat-settlement-result';
import { BaccaratStatistic } from './statistic/baccarat-statistics';
import { IBaccaratBet } from './type';

import { GameBettingOptionsContext } from 'libs/saba-games/src/_shared/react-contexts/game-betting-zone-context/game-betting-zone-context';
import type { GameBaseProps } from '../../../_shared/components/game-base/type';
interface IBaccaratState extends IGameBaseState {
    previousWinningBet?: IBaccaratBet['type'];
    roundState: string;
    isExpanded: boolean;
    activePanelId: any;
    showBetPanel: boolean;
    gameId: number;
}

@observer(setting.mainObserverNamespace)
export default class Baccarat extends GatewayGameBase<GameBaseProps, IBaccaratState> {
    override overrideClasses = {
        blockWrapper: Styles['block-wrapper'],
        betOptions: Styles['baccarat-bet-options-block'],
        info: Styles['baccarat-info-block'],
        result: Styles['baccarat-result-block'],
    };

    constructor(props: GameBaseProps) {
        super(props);
        this.state = {
            ...this.state,
            previousWinningBet: undefined,
            isExpanded: false,
            activePanelId: null,
            showBetPanel: false,
            gameId: setting.id
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
    closeConnect() {}

    setPanelId = (id: string) => {
        this.setState({ activePanelId: id });
    };

    setShowBetPanel = (show: boolean) => {
        this.setState({ showBetPanel: show });
    };

    resetBettingPanel = () => {
        this.setState({
            activePanelId: null,
            showBetPanel: false
        });
    };

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundState)
    handleRoundStateChange(roundState: string) {
        if (roundState === ROUND_STATE.LOCKING_BET) {
            this.resetBettingPanel();
        }
        this.setState({ roundState });
    }

    // override renderHeader() {
    //     return (
    //         <Header
    //             namespace={this.props.namespace}
    //             isExpanded={this.state.isExpanded}
    //             handleToggle={this.handleToggleExpand}
    //             gameId={setting.id}
    //         />
    //     );
    // }

    renderRoundHistory() {
        return <BaccaratRoundHistory namespace={this.props.namespace} language={this.props.language} />;
    }

    renderRoundIdSection() {
        return <RoundId namespace={this.props.namespace} language={this.props.language} />;
    }

    renderCountDownTimer() {
        return <CountDownTimer namespace={this.props.namespace} />;
    }

    renderBettingBlock() {
        return (
            <GameBettingOptionsContext.Provider 
                value={{ 
                    panelId: this.state.activePanelId, 
                    setPanelId: this.setPanelId,
                    show: this.state.showBetPanel,
                    setShow: this.setShowBetPanel
                }}
            >
                <BaccaratBetOptions
                    namespace={this.props.namespace}
                    previousWinningBet={this.state.previousWinningBet}
                    language={this.props.language}
                    gameName={setting.gameName}
                />
            </GameBettingOptionsContext.Provider>
        );
    }

    renderResultBlock() {
        return <BaccaratSettlementResult namespace={this.props.namespace} language={this.props.language} />;
    }

    renderStatistic() {
        return <BaccaratStatistic namespace={this.props.namespace} gameName={setting.gameName} language={this.props.language} />;
    }


    async showResult(
        hasAnimation: boolean,
        result?: gc.GameServiceMessage.TResult,
        settlementResult?: gc.GameServiceMessage.TSettlementResult,
    ) {
        if (!result) return;

        // Update the previous winning bet based on the settlement result
        if (settlementResult && this.state.roundState == ROUND_STATE.LOCKING_BET) {
            const winningBet = Object.entries(settlementResult).find(([_, value]) => Number(value) > 0)?.[0] as IBaccaratBet['type'];
            this.setState({ previousWinningBet: winningBet });
        }

        const { banker, player } = result as any;
        const numberCards =
            Object.keys(banker).filter((key) => banker[key] !== null).length +
            Object.keys(player).filter((key) => player[key] !== null).length;
        await FunctionUtils.delay((numberCards + 1) * 1000);
    }
}
