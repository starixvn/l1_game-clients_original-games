import * as gc from '@sg/sg-game-client';
import { render } from '@sg/sg-observer';
import { IPropsObserver, IStateObserver, ObserverComponent } from '../observer-component/observer-component';
import styles from './confirm-bet.module.scss';
import BetModalSuccess from '../bet-modal-success';


export interface IConfirmBet extends IStateObserver {
    totalStake: number;
    validBet: gc.Bet.IValidBet;
    betChoice: string;
    turnOffNotification: boolean;
}

const NOTIF_KEY = 'turnOffNotification';

export class ConfirmBet extends ObserverComponent<IPropsObserver, IConfirmBet> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
            totalStake: 0,
            validBet: {},
            betChoice: '',
            turnOffNotification : false, 
        } as IConfirmBet;
    }

    @render(gc.Bet.BetStore, (store) => store.lastReceivedBet)
    setTotalStake(lastReceivedBet: gc.Bet.ILastReceivedBet) {
        lastReceivedBet && this.setState({ totalStake: lastReceivedBet.value });
    }
    @render(gc.Bet.BetStore, (store) => store.betChoice)
    setBetChoice(betChoice: string) {
        betChoice && this.setState({ betChoice });
    }

    @render(gc.Bet.BetStore, (store) => store.validBet)
    setIsValidBet(validBet: gc.Bet.IValidBet) {
        this.setState({ validBet });
    }

    handleClose = () => {
        this.setState({ validBet: { value: false } });
    };

    render() {
        const { totalStake, validBet, betChoice } = this.state;
        const isShowNotification = sessionStorage.getItem(NOTIF_KEY) === 'true';

        if (!validBet?.value) {
            return <></>
        }


        if (isShowNotification) {
            return (
                <div className={styles['bet-result-container']}>
                    <BetModalSuccess />
                </div>
            )
        }
    
        return (
            <Overlay
                totalStake={totalStake}
                betChoice={betChoice}
                handleClose={this.handleClose}
            />
        )
    }
}

// 接上memberSite時，className不用style，直接接上memberSite class
const Overlay = ({ totalStake, betChoice, handleClose }) => {
    const addCommas = gc.FormatUtils.numberWithCommas;
    const totalStakeWithCommas =  addCommas(totalStake);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        sessionStorage.setItem(NOTIF_KEY, e.target.checked ? 'true' : 'false');
    };

    return (
        <div className="overlay">
            <div id="popupPanel" className="c-modal">
                <div className="c-modal__heading">
                    <i className="c-icon c-icon--info"></i>
                    <div className="c-text" title="INFORMATION">
                        {gc.Translator.t('Common.bet_info')}
                    </div>
                </div>
                <div className="c-modal__container">
                    <div className="c-modal__content">
                        <div className="c-modal__section padding-top-10">
                            <span className="c-text-group">
                                <span className="c-text-label">
                                    {gc.Translator.t('Common.bet_accepted')} : {gc.Translator.t(`SeDie.glossary_${betChoice}`)}
                                </span>
                            </span>
                            <br />
                            <div className="result-flex c-betting-results">
                                <div className="c-text-group">
                                    <div className="betting-row">
                                        <span className="c-text-label">{gc.Translator.t('Common.total_bets')}</span>
                                        <span className="colon"> : </span>
                                        <span className="c-text-value">&nbsp;1</span>
                                    </div>

                                    <div className="betting-row">
                                        <span className="c-text-label">{gc.Translator.t('Common.total_stake')}</span>
                                        <span className="colon"> : </span>
                                        <span className="c-text-value">&nbsp;{totalStakeWithCommas}</span>
                                    </div>
                                </div>
                            </div>
                            <label 
                                title="Turn off this notification"
                                className={styles['noti-label']}
                            >
                                <input 
                                    id="notification"
                                    className={styles['noti-input']}
                                    type="checkbox"
                                    onChange={handleCheckboxChange}
                                    defaultChecked={sessionStorage.getItem(NOTIF_KEY) === 'true'}
                                />
                                {gc.Translator.t('Common.turn_off_notification')}
                            </label>
                        </div>
                        <div className="c-btn-group">
                            <div
                                tabIndex={0}
                                id="popup_confirm_button"
                                className="c-btn c-btn--primary"
                                title="OK"
                                onClick={handleClose}
                            >
                                {gc.Translator.t('Common.ok')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}