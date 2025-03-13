import { observer } from '@sg/sg-observer';
import { setting } from '../game-settings';
import styles from './baccarat-bet-options.module.scss';
import { IBaccaratBet } from '../type';
import BetOptions from "../../../../_shared/components/bet-option";
import BettingBlock from "../../../../_shared/components/bet-option/betting-block";
import Odds from "../../../../_shared/components/bet-option/odd-component";
import { IPropsObserver } from "../../../../_shared/components/observer-component/observer-component";
import { ROUND_STATE } from "@sg/sg-game-client/dist/game/rounds";
import * as gc from "@sg/sg-game-client";
import { GameBettingOptionsContext } from "../../../../_shared/react-contexts/game-betting-zone-context/game-betting-zone-context";

interface IBaccaratBetOptionsProps extends IPropsObserver {
    previousWinningBet?: IBaccaratBet['type'];
    roundState: string;
    language: string;
    gameName: string;
}

interface BetOptionProps {
    odd: number;
    betChoice: IBaccaratBet['type'];
    name: string;
    fractional: boolean;
    isBoostedChoice: boolean;
    isWinningBet?: boolean;
}

@observer(setting.mainObserverNamespace)
export default class BaccaratBetOptions extends BetOptions {
    props!: IBaccaratBetOptionsProps;
    private activePanelId: string = '';
    private showPanel: boolean = false;

    constructor(props: IBaccaratBetOptionsProps) {
        super(props);
    }

    componentDidMount() {
        super.componentDidMount();
    }

    private setPanelId = (id: string) => {
        this.activePanelId = id;
        this.forceUpdate();
    };

    private setShowPanel = (show: boolean) => {
        this.showPanel = show;
        this.forceUpdate();
    };

    private isDisabled(): boolean {
        const { roundState } = this.props;
        const disabled = roundState === ROUND_STATE.SHOW_RESULT || roundState === ROUND_STATE.LOCKING_BET;
        return disabled;
    }

    private renderBetOptionContent({ odd, name, fractional, isBoostedChoice }: BetOptionProps) {
        return (
            <div className={styles['bet-container']}>
                <div className={styles['bet-name']}>{name}</div>
                <div className={styles['bet-odd']}>
                    <Odds
                        value={odd}
                        fractional={fractional}
                        isBoostedChoice={isBoostedChoice}
                    />
                </div>
            </div>
        );
    }

    private renderBetOption(props: BetOptionProps) {
        const { odd, betChoice } = props;
        return (
            <BettingBlock
                odd={odd}
                betChoice={betChoice}
                namespace={this.props.namespace}
                gameName={this.props.gameName}
                settlementResult={this.state.settlementResult}
            >
                {this.renderBetOptionContent(props)}
            </BettingBlock>
        );
    }

    public renderTotalBet(choice: string) {
        return <></>;
    }

    public renderOwnBet(choice: string) {
        return <></>;
    }

    private isBoostedChoice(choice: string, boostedChoices: string[] | undefined): boolean {
        return boostedChoices ? boostedChoices.includes(choice) : false;
    }

    render() {
        const { roundOdds, boostedOdds } = this.state;
        const { previousWinningBet } = this.props;
        const odds = roundOdds?.odds || {};
        const boostedChoices = roundOdds?.boostedChoices;
        const fractional = roundOdds?.fractional;
        const isDisabled = this.isDisabled();

        return (
            <GameBettingOptionsContext.Provider
                value={{
                    panelId: this.activePanelId,
                    setPanelId: this.setPanelId,
                    show: this.showPanel,
                    setShow: this.setShowPanel
                }}
            >
                <div className={`${styles['bet-options-wrapper']}`}>
                    <div className={styles['main-bets-container']}>
                        <div className={`${styles['bet-option']} ${previousWinningBet === 'player' ? styles['winning-bet'] : ''}`}>
                            {this.renderBetOption({
                                name: gc.Translator.t('Baccarat.glossary_player'),
                                odd: odds?.player,
                                betChoice: 'player',
                                fractional: !!fractional,
                                isBoostedChoice: this.isBoostedChoice('player', boostedChoices)
                            })}
                            {this.renderTotalBet('player')}
                            {this.renderOwnBet('player')}
                        </div>
                        <div className={`${styles['bet-option']} ${previousWinningBet === 'banker' ? styles['winning-bet'] : ''}`}>
                            {this.renderBetOption({
                                name: gc.Translator.t('Baccarat.glossary_banker'),
                                odd: odds?.banker,
                                betChoice: 'banker',
                                fractional: !!fractional,
                                isBoostedChoice: this.isBoostedChoice('banker', boostedChoices)
                            })}
                            {this.renderTotalBet('banker')}
                            {this.renderOwnBet('banker')}
                        </div>
                    </div>
                    <div className={styles['tie-container']}>
                        <div className={`${styles['bet-option']} ${previousWinningBet === 'tie' ? styles['winning-bet'] : ''}`}>
                            {this.renderBetOption({
                                name: gc.Translator.t('Baccarat.glossary_tie'),
                                odd: odds?.tie,
                                betChoice: 'tie',
                                fractional: !!fractional,
                                isBoostedChoice: this.isBoostedChoice('tie', boostedChoices)
                            })}
                            {this.renderTotalBet('tie')}
                            {this.renderOwnBet('tie')}
                        </div>
                    </div>
                    <div className={styles['pair-container']}>
                        <div className={`${styles['bet-option']} ${previousWinningBet === 'playerPair' ? styles['winning-bet'] : ''}`}>
                            {this.renderBetOption({
                                name: gc.Translator.t('Baccarat.glossary_playerPair'),
                                odd: odds?.playerPair,
                                betChoice: 'playerPair',
                                fractional: !!fractional,
                                isBoostedChoice: this.isBoostedChoice('playerPair', boostedChoices)
                            })}
                            {this.renderTotalBet('playerPair')}
                            {this.renderOwnBet('playerPair')}
                        </div>
                        <div className={`${styles['bet-option']} ${previousWinningBet === 'bankerPair' ? styles['winning-bet'] : ''}`}>
                            {this.renderBetOption({
                                name: gc.Translator.t('Baccarat.glossary_bankerPair'),
                                odd: odds?.bankerPair,
                                betChoice: 'bankerPair',
                                fractional: !!fractional,
                                isBoostedChoice: this.isBoostedChoice('bankerPair', boostedChoices)
                            })}
                            {this.renderTotalBet('bankerPair')}
                            {this.renderOwnBet('bankerPair')}
                        </div>
                    </div>
                </div>
            </GameBettingOptionsContext.Provider>
        );
    }
}