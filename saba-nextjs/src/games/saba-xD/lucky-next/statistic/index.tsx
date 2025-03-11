import Styles from "./statistic.module.scss";
// import { LuckyNextResultHistory } from "../result-history";
import { LuckyNextScoreBoard } from "../scoreboard";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";

type Props = IPropsObserver & {
    gameName?: string;
};

export interface ILuckyNextStatisticState extends IStateObserver {}

export class LuckyNextStatistic extends ObserverComponent<Props, ILuckyNextStatisticState> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <div className={`${Styles["statistic"]}`}>
                <LuckyNextScoreBoard namespace={this.props.namespace} gameName={this.props.gameName} />
                {/* <LuckyNextResultHistory namespace={this.props.namespace} /> */}
            </div>
        );
    }
}
