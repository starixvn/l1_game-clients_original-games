import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import Styles from "./baccarat-statistics.module.scss";
import { BaccaratResultHistory } from "../result-history";
import { BaccaratBigRoad } from "../scoreboard/baccarat-big-road";
import { render } from "@sg/sg-observer";
import * as gc from "@sg/sg-game-client";
import { Fragment } from "react";
import { BaccaratScoreboard } from "../scoreboard/ver1/baccarat-scoreboard";

type Props = IPropsObserver & {
    gameName: string;
};

export interface IBaccaratStatisticState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
}

export class BaccaratStatistic extends ObserverComponent<Props, IBaccaratStatisticState> {
    static defaultProps = {
        gameName: 'baccarat'
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            ...this.state,
            rounds: []
        };
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(rounds: gc.RoundHistories.RoundHistory[]) {
        this.setState({ rounds });
    }

    render() {

        return (
            <Fragment>
                <div className={`${Styles["statistic"]}`}>
                    <BaccaratScoreboard namespace={this.props.namespace}
                        gameName={this.props.gameName}
                    />
                    <BaccaratResultHistory namespace={this.props.namespace} />
                </div>

            </Fragment >
        );
    }
} 