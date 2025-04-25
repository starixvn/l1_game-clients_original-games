import * as gc from '@sg/sg-game-client';
import { Rounds } from '@sg/sg-game-client';
import { render } from '@sg/sg-observer';
import classNames from 'classnames';
import BettingBlock from '../../../../../_shared/components/bet-option/betting-block';
import Styles from '../../../../../_shared/components/bet-option/bet-option.module.scss';
import { GameBettingOptionsContext, GameBettingZoneContext } from '../../../../../_shared/react-contexts/game-betting-zone-context/game-betting-zone-context';
import BetPanelComponent from '../../../../../_shared/components/bet-panel/bet-panel';
// import { animationStateTransmitter } from '../../transmitters/animation-state.transmitter';
import { BettingBlockProps, IBettingBlockState } from '../../../../../_shared/components/bet-option/betting-block';

interface ICoinTossBettingBlockState extends IBettingBlockState {
      isAnimationComplete: boolean;
}

class CoinTossBettingBlock extends BettingBlock {
      state: ICoinTossBettingBlockState;

      constructor(props: BettingBlockProps) {
            super(props);
            this.state = {
                  betChoice: '',
                  odd: 0,
                  isAuthorized: false,
                  isSignedIn: false,
                  dispose: null,
                  isFinishShowResult: false,
                  isShowStaticHighlight: undefined,
                  isShowBetSlip: false,
                  isAnimationComplete: false
            };
      }

      @render(gc.Rounds.RoundTimeStore, (store) => store.roundState, { fireImmediately: false })
      renderCountDownTimerState(roundState: string) {
            super.renderCountDownTimerState(roundState);
            if (roundState === Rounds.ROUND_STATE.STARTING_ROUND) {
                  this.setState((prevState) => ({
                        ...prevState,
                        isAnimationComplete: false
                  }));
            }
      }
      private handleAnimationComplete = (isComplete: boolean) => {
            this.setState((prevState) => ({
                  ...prevState,
                  isAnimationComplete: isComplete
            }));
      };

      componentDidMount() {
            super.componentDidMount?.();
            // animationStateTransmitter.onAnimationComplete(this.handleAnimationComplete);
      }

      componentWillUnmount() {
            super.componentWillUnmount?.();
            // animationStateTransmitter.removeAnimationCompleteListener(this.handleAnimationComplete);
      }

      render() {
            const { children, namespace, gameName, settlementResult, betChoice } = this.props;
            const { odd, isFinishShowResult, isShowStaticHighlight, isShowBetSlip, isAnimationComplete } = this.state;

            let flashAnimationClass = '';
            const bettingZoneState = {
                  gameName,
                  betChoice,
                  odd,
            };

            if (isFinishShowResult && isAnimationComplete && settlementResult?.[betChoice]) {
                  flashAnimationClass = 'flash-and-keep-background-color';
            } else if (isShowStaticHighlight && settlementResult?.[betChoice]) {
                  flashAnimationClass = 'highlight-static-bet-choice';
            }

            return (
                  <GameBettingOptionsContext.Consumer>
                        {({ panelId, setPanelId, show, setShow }) => {
                              return (
                                    <GameBettingZoneContext.Provider value={bettingZoneState}>
                                          <div
                                                className={classNames(
                                                      `${Styles['betting-block']} ${Styles[flashAnimationClass]}`,
                                                      {
                                                            [Styles['open-panel-background-color']]: panelId === betChoice
                                                      }
                                                )}
                                                onClick={this.handleOnClick({ panelId, setPanelId, show, setShow })}
                                          >
                                                {children}
                                          </div>
                                          {isShowBetSlip && <BetPanelComponent namespace={namespace} />}
                                    </GameBettingZoneContext.Provider>
                              );
                        }}
                  </GameBettingOptionsContext.Consumer>
            );
      }
}

export default CoinTossBettingBlock;