import { COIN_TOSS_GAME_ID, COIN_TOSS_GAME_NAMESPACE } from "../../../constant/app";
import CoinTossHeader from "../../games/saba-club/coin-toss/header"
import CoinTossPage from "../../games/saba-club/coin-toss/page"


export const gamePageMap = {
    [COIN_TOSS_GAME_ID]: { component: CoinTossPage, namespace: COIN_TOSS_GAME_NAMESPACE },
};

export const gameHeaderMap = {
    [COIN_TOSS_GAME_ID]: CoinTossHeader
};