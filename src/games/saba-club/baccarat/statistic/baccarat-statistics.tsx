import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import Styles from "./baccarat-statistics.module.scss";
import { BaccaratScoreboard } from "../scoreboard";
import { BaccaratResultHistory } from "../result-history";

type Props = IPropsObserver & {
    gameName?: string;
};

export interface IBaccaratStatisticState extends IStateObserver { }

export class BaccaratStatistic extends ObserverComponent<Props, IBaccaratStatisticState> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <div className={`${Styles["statistic"]}`}>
                <BaccaratScoreboard namespace={this.props.namespace} gameName={this.props.gameName} />
                <BaccaratResultHistory namespace={this.props.namespace} />
            </div>
        );
    }
} 