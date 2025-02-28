import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import Styles from "./baccarat-statistics.module.scss";
import { BaccaratResultHistory } from "../result-history";
import { BaccaratBigRoad } from "../scoreboard/baccarat-scoreboards";
import { render } from "@sg/sg-observer";
import * as gc from "@sg/sg-game-client";
import { Fragment } from "react";

type Props = IPropsObserver & {
    gameName?: string;
};

export interface IBaccaratStatisticState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
}

export class BaccaratStatistic extends ObserverComponent<Props, IBaccaratStatisticState> {
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
                    <BaccaratBigRoad
                        namespace={this.props.namespace}
                        gameName={this.props.gameName}
                    />
                    <BaccaratResultHistory namespace={this.props.namespace} />
                </div>

            </Fragment>
        );
    }
} 