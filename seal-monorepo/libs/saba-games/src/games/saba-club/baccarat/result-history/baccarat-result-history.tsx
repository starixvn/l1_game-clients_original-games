import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";

import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import { Result } from "../baccarat";
import { cardStateEmitter } from "../services/card-state-emitter";
import { BaccaratSettlementResult } from "../type";
import Styles from "./baccarat-result-history.module.scss";
import { ResultCardSection } from "./result-card-section";

export interface IBaccaratResultHistoryProps extends IPropsObserver {
  language: string;
}

export interface IBaccaratResultHistoryState extends IStateObserver {
  rounds: gc.RoundHistories.RoundHistory[];
}

const numberOfResult = 102;

export class BaccaratResultHistory extends ObserverComponent<
  IBaccaratResultHistoryProps,
  IBaccaratResultHistoryState
> {
  private openedCardsHandler: (count: number) => void;

  constructor(props: IBaccaratResultHistoryProps) {
    super(props);
    this.openedCardsHandler = this.handleOpenedCardsChange.bind(this);
  }

  componentDidMount() {
    super.componentDidMount?.();
    cardStateEmitter.onOpenedCardsChange(this.openedCardsHandler);
  }

  componentWillUnmount() {
    super.componentWillUnmount?.();
    cardStateEmitter.removeOpenedCardsListener(this.openedCardsHandler);
  }

  private handleOpenedCardsChange(count: number) {
    if (count > 0) {
      this.updateRoundHistory();
    }
  }

  @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
  renderRoundHistory(rounds: gc.RoundHistories.RoundHistory[]) {
    this.updateRoundHistory(rounds);
  }

  private updateRoundHistory(rounds?: gc.RoundHistories.RoundHistory[]) {
    if (rounds) {
      this.setState({ rounds: rounds.slice(0, numberOfResult) });
    }
  }

  private getSettlementResult(
    settlementResult: gc.GameServiceMessage.TSettlementResult,
  ): BaccaratSettlementResult {
    const result: BaccaratSettlementResult = {
      winner: 'player',
      player: false,
      banker: false,
      tie: false,
      playerPair: false,
      bankerPair: false,
    };

    if (settlementResult && typeof settlementResult === 'object') {
      result.player = !!settlementResult.player;
      result.banker = !!settlementResult.banker;
      result.tie = !!settlementResult.tie;

      if (settlementResult.player) {
        result.winner = 'player';
      } else if (settlementResult.banker) {
        result.winner = 'banker';
      } else if (settlementResult.tie) {
        result.winner = 'tie';
      }

      const gameData = settlementResult.gameData;
      if (gameData && typeof gameData === 'object') {
        const data = gameData as Record<string, unknown>;
        result.playerPair = !!data.playerPair;
        result.bankerPair = !!data.bankerPair;
      }
    }

    return result;
  }

  renderRoundResult(
    roundHistory: gc.RoundHistories.RoundHistory,
    index: number,
  ) {
    const result = roundHistory?.result as Result;
    const settlement = this.getSettlementResult(roundHistory.settlementResult);

    return (
      <div className={Styles.historyRow} key={index}>
        <div className={Styles.contentWrapper}>
          <span
            className={Styles.roundNumber}
          >{`${gc.Translator.t('Common.round')} ${roundHistory?.roundId}`}</span>
          <ResultCardSection cards={result?.player} />
          <span className={Styles.divider} />
          <ResultCardSection cards={result?.banker} />
          <span className={`${Styles.winner} ${Styles[settlement.winner]}`}>
            {gc.Translator.t(`Baccarat.glossary_${settlement.winner}`)}
          </span>
        </div>
      </div>
    );
  }

  render() {
    const { rounds } = this.state;
    const { language } = this.props;

    if (!rounds || rounds.length === 0) {
      return <div />;
    }

    return (
      <div className={Styles.resultHistoryContainer}>
        <div className={Styles['result-title']}>
          {gc.Translator.t('Common.result')}
        </div>
        <div className={Styles.resultHistory}>
          <div className={Styles.header}>
            <span />
            <span>{gc.Translator.t('Baccarat.glossary_player')}</span>
            <span />
            <span>{gc.Translator.t('Baccarat.glossary_banker')}</span>
            <span />
          </div>
          <div className={Styles.historyContent}>
            {rounds.map(this.renderRoundResult.bind(this))}
          </div>
        </div>
      </div>
    );
  }
}
