import * as gc from '@sg/sg-game-client';
import styles from './header.module.scss';
import classNames from 'classnames';

export const SieDieHeader = ({ isExpanded, handleToggle }) => {
    const gameName = gc.Translator.translate('SeDie.game_name');
    const oddsEven = gc.Translator.translate('SeDie.choices_type1');
    const redWhite = gc.Translator.translate('SeDie.choices_type2');

    return (
        <div className={styles['game-title']} onClick={handleToggle}>
            <div className={classNames(styles['collapse-btn'], {
                [styles['collapsed']]: !isExpanded
            })}>
                <div className={styles['collapse-icon']}></div>
            </div>
            <div className={styles['game-header']}>
                <div className={styles['game-icon']}>
                </div>
                <div className={styles['game-name']}>
                    {gameName}
                </div>
            </div>
            {isExpanded && (
                <>
                    <span className={styles['game-option']}>{oddsEven}</span>
                    <span className={styles['game-option']}>{redWhite}</span>
                </>
            )}
        </div>
    );
};

