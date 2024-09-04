import { observer } from "observer";
import { Col } from "react-bootstrap";
import { CountDownTimer, RoundId } from "../../components";
import GameBase, { IGameBaseState } from "../../components/game-base";
import { configGameContainer } from "../../components/game-base/startup";
import type { GameBaseProps } from "../../components/game-base/type";
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

    // renderNotice(): JSX.Element {
    //     return <Notice namespace={this.props.namespace}></Notice>;
    // }

    // renderWarning(): JSX.Element {
    //     return <Warning namespace={this.props.namespace}></Warning>;
    // }
}
