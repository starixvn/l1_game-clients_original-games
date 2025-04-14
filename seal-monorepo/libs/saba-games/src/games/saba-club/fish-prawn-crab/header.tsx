import * as gc from "@sg/sg-game-client";
import classNames from "classnames";
import styles from './header.module.scss';

export const FishPrawnCrabHeader = ({ isExpanded, handleToggle }) => {
    const gameName = gc.Translator.translate('FishPrawnCrab.game_name');
    const gameType = gc.Translator.translate('FishPrawnCrab.choices_type');

    return (
        <div className={styles['game-title']} onClick={handleToggle}>
            <div className={styles['title-with-icon']}>
                <div
                    className={classNames(styles['collapse-btn'], {
                        [styles['collapsed']]: !isExpanded,
                    })}
                >
                    <div className={styles['collapse-icon']}></div>
                </div>
                <div className={styles['game-header']}>
                    <div className={styles['game-icon']}></div>
                    <div className={styles['game-name']}>{gameName}</div>
                </div>
            </div>

            {isExpanded && (
                <div className={styles['game-option-container']}>
                    <span className={styles['game-option']}>{gameType}</span>
                </div>
            )}
        </div>
    );
};

// Maintain backward compatibility
export const Header = FishPrawnCrabHeader; 