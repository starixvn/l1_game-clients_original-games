import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import Styles from "./baccarat-statistics.module.scss";
import { BaccaratScoreboard } from "../scoreboard";
import { BaccaratResultHistory } from "../result-history";
import { BaccaratBigRoad } from "../scoreboard/components/baccarat/big-road/BaccaratBigRoad";
import { render } from "@sg/sg-observer";
import * as gc from "@sg/sg-game-client";
import { Fragment } from "react";
import { testRounds } from "../scoreboard/test";

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
                    {/* <BaccaratScoreboard namespace={this.props.namespace} gameName={this.props.gameName} /> */}

                    <BaccaratBigRoad
                        namespace={this.props.namespace}
                        gameName={this.props.gameName}
                    />
                    <BaccaratResultHistory namespace={this.props.namespace} />
                </div>
                {/* <div className={Styles["big-road-container"]}>
                    {this.state.rounds && this.state.rounds.length > 0 ? (
                        <BaccaratBigRoad
                            namespace={this.props.namespace}
                            gameName={this.props.gameName}
                        />
                    ) : (
                        <div>No rounds data available</div>
                    )}
                </div> */}
            </Fragment>
        );
    }
} 