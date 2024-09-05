import { observer } from "@sg/sg-observer";
import { Col } from "react-bootstrap";
import { CountDownTimer, RoundId } from "../../_shared/components";
import GameBase, { IGameBaseState } from "../../_shared/components/game-base";
import { configGameContainer } from "../../_shared/components/game-base/startup";
import type { GameBaseProps } from "../../_shared/components/game-base/type";
import { containerOptions, settingsBigSmall, siteConfigs } from "./game-settings";

configGameContainer(settingsBigSmall.name, containerOptions, siteConfigs);

@observer(settingsBigSmall.name)
export default class BigSmall extends GameBase<GameBaseProps, IGameBaseState> {
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
}
