import Styles from "./statistic.module.scss";
import { BigSmallScoreBoard } from "../scoreboard";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";

type Props = IPropsObserver & {
    gameName?: string;
};

export interface IBigSmallStatisticState extends IStateObserver {}

export class BigSmallStatistic extends ObserverComponent<Props, IBigSmallStatisticState> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <div className={`${Styles["statistic"]}`}>
                <BigSmallScoreBoard namespace={this.props.namespace} gameName={this.props.gameName} />
                {/* <BigSmallResultHistory namespace={this.props.namespace} /> */}
            </div>
        );
    }
}
