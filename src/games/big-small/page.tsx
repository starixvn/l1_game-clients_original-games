import * as gc from "@sg/sg-game-client";
import { Connection } from "@sg/sg-game-client";
import { handle, observer } from "@sg/sg-observer";
import { Col } from "react-bootstrap";
import CountDownTimer from "../../_shared/components/count-down-timer";
import RoundId from "../../_shared/components/round-id";
import GameBase, { IGameBaseState } from "../../_shared/components/game-base";
import { configGameContainer } from "../../_shared/components/game-base/startup";
import type { GameBaseProps } from "../../_shared/components/game-base/type";
import { containerOptions, settingsBigSmall, siteConfigs } from "./game-settings";
import { FunctionUtils } from "../../_shared/utils/funtion-utils";

@observer(settingsBigSmall.name)
export default class BigSmall extends GameBase<GameBaseProps, IGameBaseState> {
    constructor(props: GameBaseProps) {
        super(props);
        configGameContainer(settingsBigSmall.name, containerOptions, siteConfigs);
    }

    @handle(Connection.ConnectionHandlers.CloseConnectHandler)
    closeConnect() {}

    renderRoundIdSection() {
        return (
            <Col>
                <RoundId namespace={this.props.namespace} />
            </Col>
        );
    }

    renderCountDownTimer() {
        return <CountDownTimer namespace={this.props.namespace} />;
    }

    async showResult(
        hasAnimation: boolean,
        result?: gc.GameServiceMessage.TResult,
        settlementResult?: gc.GameServiceMessage.TSettlementResult
    ) {
        //implement animation
        await FunctionUtils.delay(1000);
    }
}
