import classNames from "classnames";
import { gamePageMap } from "../../../utils/component-util"
import styles from "./game-list-tab.module.scss";
import { SE_DIE_GAME_ID, VIP_SE_DIE_GAME_ID } from "../../../../../../saba-games/constant/app";


export const GameListTab = ({ offerGames, selectedGameId, onTabClick }) => {
    return (
        <div className={styles['tab-button-wrapper']}>
            {offerGames.map(game => (
                <div
                    key={game.gameId}
                    onClick={() => onTabClick(game.gameId)}
                    className={classNames(styles['tab-button'], { [styles['tab-button-active']]: game.gameId === selectedGameId })}
                >
                    <div 
                        className={classNames({
                            [styles['sedie-icon']]: game.gameId === SE_DIE_GAME_ID,
                            [styles['vip-sedie-icon']]: game.gameId === VIP_SE_DIE_GAME_ID,
                        })}
                    ></div>
                    <span>{gamePageMap[game.gameId].namespace}</span>
                
                </div>
            ))}
        </div>
    )

}