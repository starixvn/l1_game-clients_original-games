import { observer } from "observer";
import { Col } from "react-bootstrap";
import { CountDownTimer, RoundId } from "../../components";
import GameBase from "../../components/game-base";
import { configGameContainer } from "../../components/game-base/startup";
import { containerOptions, settings, siteConfigs } from "./game-settings";
import SeDieRoundHistory from "./round-history";
import LuckyNextBetOptions from "./lucky-next-bet-options";
import LuckyNextSettlementResult from "./settlement-result";

configGameContainer(settings.name, containerOptions, siteConfigs);
const observerNamespace = settings.mainObserverNamespace;
@observer(observerNamespace)
export default class LuckyNext extends GameBase<any> {
    constructor(props: any) {
        super(props);
    }

    // renderStatistic() {
    //     return (
    //         <Col>
    //             <SeDieRoundHistory namespace={observerNamespace} />
    //         </Col>
    //     );
    // }

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
        return <LuckyNextBetOptions namespace={observerNamespace} />;
    }

    // renderResultBlock() {
    //     return <LuckyNextSettlementResult namespace={observerNamespace} />;
    // }
}
