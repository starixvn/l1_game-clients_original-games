import * as gc from "@sg/sg-game-client";
import { handle, observer } from "@sg/sg-observer";
import CountDownTimer from "../../../_shared/components/count-down-timer";
import { IGameBaseState } from "../../../_shared/components/game-base";
import GatewayGameBase from "../../../_shared/components/game-base/gateway-gamebase";
import { configGameContainer } from "../../../_shared/components/game-base/startup";
import RoundId from "../../../_shared/components/round-id";
import { FunctionUtils } from "../../../_shared/utils/funtion-utils";
import VIPSeDieBetOptions from "./bet-option/vip-sedie-bet-options";
import { containerOptions, setting } from "./game-settings";
import SeDieRoundHistory from "../sedie/round-history";
import SeDieSettlementResult from "../sedie/settlement-result";
import { SedieStatistic } from "../sedie/statistic";
import { GameBettingOptionsContext } from '../../../_shared/react-contexts/game-betting-zone-context/game-betting-zone-context';

interface ISieDiePageState extends IGameBaseState {
    activePanelId: any;
    showBetPanel: boolean;
}

@observer(setting.mainObserverNamespace)
export default class VipSeDie extends GatewayGameBase<{ namespace: string, language: string }, ISieDiePageState> {
    constructor(props: { namespace: string, language: string }) {
        super(props);
        configGameContainer(setting.name, containerOptions);
        this.state = {
            ...this.state,
            activePanelId: null,
            showBetPanel: false,
        };
    }

    @handle(gc.Connection.ConnectionHandlers.CloseConnectHandler, (handler) => handler.handleGateway())
    closeConnect() {
    };

    setPanelId = (id: string) => {
        this.setState({ activePanelId: id });
    };

    setShowBetPanel = (show: boolean) => {
        this.setState({ showBetPanel: show });
    };

    renderRoundHistory() {
        return (
            <SeDieRoundHistory
                namespace={this.props.namespace}
                language={this.props.language}
            />
        );
    }

    renderRoundIdSection() {
        return (
            <RoundId
                namespace={this.props.namespace}
                language={this.props.language}
            />
        );
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
                <VIPSeDieBetOptions
                    gameName={setting.gameName}
                    namespace={this.props.namespace}
                    language={this.props.language}
                />
            </GameBettingOptionsContext.Provider>
        );
    }

    renderResultBlock() {
        return <SeDieSettlementResult namespace={this.props.namespace} />;
    }

    renderStatistic() {
        return (
            <SedieStatistic
                namespace={this.props.namespace}
                gameName={setting.gameName}
                language={this.props.language}
            />
        );
    }

    async showResult(
        hasAnimation: boolean,
        result?: gc.GameServiceMessage.TResult,
        settlementResult?: gc.GameServiceMessage.TSettlementResult
    ) {
        await FunctionUtils.delay(2000);
    }
} 