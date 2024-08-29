import { observer } from "observer";
import { Col } from "react-bootstrap";
import { CountDownTimer, RoundId } from "../../components";
import GameBase, { IGameBaseState } from "../../components/game-base";
import { configGameContainer } from "../../components/game-base/startup";
import { GameBaseProps } from "../../components/game-base/type";
import { containerOptions, settings, siteConfigs } from "./game-settings";
import SeDieRoundHistory from "./round-history";
import SeDieBetOptions from "./sedie-bet-options";
import SeDieSettlementResult from "./settlement-result";

configGameContainer(settings.name, containerOptions, siteConfigs);
const observerNamespace = settings.mainObserverNamespace;
@observer(observerNamespace)
export default class SeDie extends GameBase<GameBaseProps, IGameBaseState> {
    constructor(props: any) {
        super(props);
    }

    renderStatistic() {
        return (
            <Col>
                <SeDieRoundHistory namespace={observerNamespace} />
            </Col>
        );
    }

    renderRoundIdSection() {
        return (
            <Col>
                <RoundId namespace={observerNamespace} />
            </Col>
        );
    }

    renderCountDownTimer() {
        return <CountDownTimer namespace={observerNamespace} />;
    }

    renderBettingBlock() {
        return <SeDieBetOptions namespace={observerNamespace} />;
    }

    renderResultBlock() {
        return <SeDieSettlementResult namespace={observerNamespace} />;
    }
}
