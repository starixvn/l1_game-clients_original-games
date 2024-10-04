import Styles from "./statistic.module.scss";
import { SedieResultHistory } from "../result-history";
import { SedieScoreboard } from "../scoreboard";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../_shared/components/observer-component/observer-component";

type Props = {
    gameName?: string;
};

export interface ISedieStatisticState extends IStateObserver {}

export class SedieStatistic extends ObserverComponent<IPropsObserver, ISedieStatisticState> {
    constructor(props: IPropsObserver) {
        super(props);
    }

    render() {
        return (
            <div className={`${Styles["statistic"]}`}>
                <div>
                    <SedieScoreboard />
                </div>
                <div>
                    <SedieResultHistory namespace={this.props.namespace} />
                </div>
            </div>
        );
    }
}
