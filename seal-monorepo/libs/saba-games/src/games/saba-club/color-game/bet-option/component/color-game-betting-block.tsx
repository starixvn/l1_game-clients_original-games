import * as gc from '@sg/sg-game-client';
import { render } from '@sg/sg-observer';
import classNames from 'classnames';
import BettingBlock from '../../../../../_shared/components/bet-option/betting-block';
import Styles from '../../../../../_shared/components/bet-option/bet-option.module.scss';
import { GameBettingOptionsContext, GameBettingZoneContext } from '../../../../../_shared/react-contexts/game-betting-zone-context/game-betting-zone-context';
import BetPanelComponent from '../../../../../_shared/components/bet-panel/bet-panel';
import { BettingBlockProps, IBettingBlockState } from '../../../../../_shared/components/bet-option/betting-block';

interface IColorGameBettingBlockState extends IBettingBlockState {
      isAnimationComplete: boolean;
}

class ColorGameBettingBlock extends BettingBlock {
      state: IColorGameBettingBlockState;

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

      @render(gc.Settlements.SettlementStore, (store) => store.isFinishedPlayAnimation)
      finishPlayAnimation(isFinishedPlayAnimation: boolean) {
            this.setState((prevState) => ({
                  ...prevState,
                  isAnimationComplete: isFinishedPlayAnimation
            }));
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

export default ColorGameBettingBlock;