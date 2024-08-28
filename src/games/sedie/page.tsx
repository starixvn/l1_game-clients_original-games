import { observer } from "observer";
import { Col } from "react-bootstrap";
import { CountDownTimer, RoundId } from "../../components";
import GameBase from "../../components/game-base";
import { startGame } from "../../components/game-base/startup";
import SeDieBetOptions from "./bet-options";
import { containerOptions, settings, siteConfigs } from "./game-settings";

startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);
@observer(settings.name)
export default class SeDie extends GameBase<any> {
    constructor(props: any) {
        super(props);
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
