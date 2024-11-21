import * as gc from "@sg/sg-game-client";
import { handle, observer } from "@sg/sg-observer";
import { Col } from "react-bootstrap";
import CountDownTimer from "../../../_shared/components/count-down-timer";
import { IGameBaseState } from "../../../_shared/components/game-base";
import GatewayGameBase from "../../../_shared/components/game-base/gateway-gamebase";
import { configGameContainer } from "../../../_shared/components/game-base/startup";
import type { GameBaseProps } from "../../../_shared/components/game-base/type";
import RoundId from "../../../_shared/components/round-id";
import { FunctionUtils } from "../../../_shared/utils/funtion-utils";
import { containerOptions, setting } from "./game-settings";

@observer(setting.name)
export default class BigSmall extends GatewayGameBase<GameBaseProps, IGameBaseState> {
    constructor(props: GameBaseProps) {
        super(props);
        configGameContainer(setting.name, containerOptions);
    }

    @handle(gc.Connection.ConnectionHandlers.CloseConnectHandler, (handler, gameName: string) => handler.handleGateway())
    closeConnect() {
        return setting.name;
    }

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
