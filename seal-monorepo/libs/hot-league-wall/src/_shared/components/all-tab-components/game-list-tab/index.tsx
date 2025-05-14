import * as gc from "@sg/sg-game-client";
import classNames from "classnames";
import { gamePageMap } from "../../../utils/component-util"
import styles from "./game-list-tab.module.scss";
import { COIN_TOSS_GAME_ID } from "../../../../../../saba-games/constant/app";


export const GameListTab = ({ offerGames, selectedGameId, onTabClick }) => {
    const t = (key) => gc.Translator.translate(key, { languageId: gc.Translator.getCurrentLanguageId() });

    const getGameTabName = (namespace?: string) => {
        if (!namespace) return '';
        return t(`${namespace}.game_name`);
    };

    return (
        <div className={styles['tab-button-wrapper']}>
            {offerGames.map(game => (
                <div
                    key={game.gameId}
                    onClick={() => onTabClick(game.gameId)}
                    className={classNames({
                        [styles['tab-button']]: true,
                        [styles['tab-button-active']]: game.gameId === selectedGameId,
                        [styles['tab-button-coin-toss']]: game.gameId === COIN_TOSS_GAME_ID
                    })}
                >
                    <div
                        className={classNames({
                            [styles['coin-toss-icon']]: game.gameId === COIN_TOSS_GAME_ID
                        })}
                    ></div>
                    <span>{getGameTabName(gamePageMap[game.gameId].namespace)}</span>
                </div>
            ))}
        </div>
    )
}