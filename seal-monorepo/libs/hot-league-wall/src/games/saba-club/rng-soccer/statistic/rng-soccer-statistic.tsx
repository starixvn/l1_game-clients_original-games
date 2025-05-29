import styles from '../rng-soccer.module.scss';
import closeIcon from '../../../../assets/rng-soccer/close.svg';
import { BetPercentages } from '../../../../_shared/components/bet-percentages';
import { RNGSoccer_GAME_NAMESPACE } from 'libs/hot-league-wall/constant/app';

interface RNGSoccerStatisticProps {
    namespace: string;
    language: string;
    isPopupVisible: boolean;
    togglePopup: () => void;
}

export default function RNGSoccerStatistic({ namespace, language, isPopupVisible, togglePopup }: RNGSoccerStatisticProps) {
    return (
        <div className={`${styles['wrapper-popup']} ${isPopupVisible ? styles['active'] : ''}`}>
            {/* percentage */}
            {/* TODO: refactor scoreboardCharacter */}
            <BetPercentages
                gameName={RNGSoccer_GAME_NAMESPACE}
                scoreboardCharacter={{
                    home: 'home',
                    draw: 'draw',
                    away: 'away',
                }}
                settlements={[]}
            />
            <div className={styles['close-popup']} onClick={togglePopup}>
                <img src={closeIcon} alt="close" className={styles['close-icon']} />
            </div>
        </div>
    );
} 