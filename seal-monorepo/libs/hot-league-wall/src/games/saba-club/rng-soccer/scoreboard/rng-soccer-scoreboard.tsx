import React from 'react';
import * as gc from '@sg/sg-game-client';
import { render } from '@sg/sg-observer';
import { IPropsObserver, IStateObserver, ObserverComponent } from '../../../../_shared/components/observer-component/observer-component';
import styles from './rng-soccer-scoreboard.module.scss';
import { BigRoadScoreboard, Converter } from 'sc-scoreboards';
import { RNGSoccerChoices, RNGSoccerResult, RNGSoccerRoundHistory } from '../type';
import { BetPercentages } from '../../../../_shared/components/bet-percentages';
import RNGSoccerBigRoad from './rng-soccer-big-road';

interface Props extends IPropsObserver {
    noRender?: boolean;
    gameName: string;
    maxRows?: number;
}

interface IBaccaratScoreboardState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
    isLockingBet: boolean;
}

class RNGSoccerBigRoadConverter extends Converter<RNGSoccerRoundHistory> {
    static addBlinkNode(rounds: RNGSoccerRoundHistory[]) {
        const lastRound = rounds.find((round) => round.settlementResult?.home || round.settlementResult?.draw || round.settlementResult?.away);
        if (!lastRound) return;

        const blinkRound: RNGSoccerRoundHistory = {
            roundId: lastRound.roundId,
            settlementResult: {
                home: lastRound.settlementResult?.home || false,
                draw: lastRound.settlementResult?.draw || false,
                away: lastRound.settlementResult?.away || false
            },
            result: lastRound.result
        };

        rounds.unshift(blinkRound);
    }

    static readonly instance = new RNGSoccerBigRoadConverter();

    protected positiveKey(): string {
        return RNGSoccerChoices.home;
    }

    protected specialKey(): string {
        return RNGSoccerChoices.draw;
    }

    convert(group: RNGSoccerRoundHistory[]): boolean {
        if (group.length === 0) return false;
        return group[0].settlementResult?.home === true;
    }
}

export class RNGSoccerScoreboard extends ObserverComponent<Props, IBaccaratScoreboardState> {
    private readonly DEFAULT_MAX_ROWS = 6;
    private readonly bigRoad: BigRoadScoreboard<RNGSoccerRoundHistory>;

    constructor(props: Props) {
        super(props);
        this.state = {
            rounds: [],
            isLockingBet: false,
            dispose: () => { },
        };
        this.bigRoad = new BigRoadScoreboard({
            converter: RNGSoccerBigRoadConverter.instance,
            height: this.DEFAULT_MAX_ROWS,
        });
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    private onRoundHistoryUpdate(rounds: gc.RoundHistories.RoundHistory[]) {
        this.setState({ rounds, isLockingBet: false });
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isLocking)
    private renderCountDownTimerState(isLocking: boolean) {
        if (isLocking) {
            this.setState({ isLockingBet: true });
        }
    }

    render(): React.ReactElement {
        const { noRender, gameName, maxRows = this.DEFAULT_MAX_ROWS } = this.props;
        const { rounds, isLockingBet } = this.state;

        if (noRender || !rounds?.length) {
            return <div />;
        }

        const input = [...rounds]
            .map((round) => ({
                roundId: round.roundId,
                settlementResult: {
                    home: round.settlementResult?.home || false,
                    draw: round.settlementResult?.draw || false,
                    away: round.settlementResult?.away || false
                },
                result: round.result as unknown as RNGSoccerResult
            }))
            .reverse();
        this.bigRoad.initialize(input, isLockingBet);
        const rows = this.bigRoad.rows();

        return (
            <div className={styles.scoreboard}>
                <BetPercentages
                    gameName={gameName}
                    scoreboardCharacter={{
                        home: RNGSoccerChoices.home,
                        draw: RNGSoccerChoices.draw,
                        away: RNGSoccerChoices.away,
                    }}
                    settlements={input.map(item => item.settlementResult)}
                />

                <RNGSoccerBigRoad maxRows={maxRows} rows={rows} />
            </div>
        );
    }
}
