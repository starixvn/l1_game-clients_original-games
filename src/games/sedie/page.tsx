import { observer } from "observer";
import { Col } from "react-bootstrap";
import { CountDownTimer, RoundId } from "../../components";
import GameBase from "../../components/game-base";
import { configGameContainer } from "../../components/game-base/startup";
import { containerOptions, settings, siteConfigs } from "./game-settings";
import SeDieRoundHistory from "./round-history";
import SeDieBetOptions from "./sedie-bet-options";

configGameContainer(settings.name, containerOptions, siteConfigs);

@observer(settings.name)
export default class SeDie extends GameBase<any> {
    constructor(props: any) {
        super(props);
    }

    renderStatistic() {
        return (
            <Col>
                <SeDieRoundHistory namespace={settings.name} />
            </Col>
        );
    }

    renderRoundIdSection() {
        return (
            <Col>
                <RoundId namespace={settings.name} />
            </Col>
        );
    }

    renderCountDownTimer() {
        return (
            <Col>
                <CountDownTimer namespace={settings.name} />
            </Col>
        );
    }

    renderBettingBlock() {
        return <SeDieBetOptions namespace={settings.mainObserverNamespace} />;
    }
}
