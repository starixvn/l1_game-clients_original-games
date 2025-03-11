import Styles from "./big-small-statistic.module.scss";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import BigSmallScoreBoard from "../scoreboard/big-small-scoreboard";
import { BigSmallResultHistory } from "../result-history";

type Props = IPropsObserver & {
    gameName?: string;
};

export interface IBigSmallStatisticState extends IStateObserver {}

export default class BigSmallStatistic extends ObserverComponent<Props, IBigSmallStatisticState> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <div className={`${Styles["statistic"]}`}>
                <BigSmallScoreBoard namespace={this.props.namespace} gameName={this.props.gameName} />
                <BigSmallResultHistory namespace={this.props.namespace} />
            </div>
        );
    }
}
