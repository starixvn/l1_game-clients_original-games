import Styles from "./statistic.module.scss";
import { SedieResultHistory } from "../result-history";
import { SedieScoreBoard } from "../scoreboard";
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
                <SedieScoreBoard namespace={this.props.namespace} />
                <div>
                    <SedieResultHistory namespace={this.props.namespace} />
                </div>
            </div>
        );
    }
}
