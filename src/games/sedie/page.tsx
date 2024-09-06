import { Connection } from "@sg/sg-game-client";
import { handle, observer } from "@sg/sg-observer";
import { CountDownTimer, RoundId } from "../../_shared/components";
import GameBase, { IGameBaseState } from "../../_shared/components/game-base";
import { configGameContainer } from "../../_shared/components/game-base/startup";
import type { GameBaseProps } from "../../_shared/components/game-base/type";
import { containerOptions, settingsSeDie, siteConfigs } from "./game-settings";
import SeDieRoundHistory from "./round-history";
import SeDieBetOptions from "./sedie-bet-options";
import SeDieSettlementResult from "./settlement-result";

configGameContainer(settingsSeDie.name, containerOptions, siteConfigs);
@observer(settingsSeDie.mainObserverNamespace)
export default class SeDie extends GameBase<GameBaseProps, IGameBaseState> {
    @handle(Connection.ConnectionHandlers.CloseConnectHandler)
    closeConnect() {}

    renderStatistic() {
        return <SeDieRoundHistory namespace={this.props.namespace} />;
    }

    renderRoundIdSection() {
        return <RoundId namespace={this.props.namespace} />;
    }

    renderCountDownTimer() {
        return <CountDownTimer namespace={this.props.namespace} />;
    }

    renderBettingBlock() {
        return <SeDieBetOptions namespace={this.props.namespace} />;
    }

    renderResultBlock() {
        return <SeDieSettlementResult namespace={this.props.namespace} />;
    }
}
