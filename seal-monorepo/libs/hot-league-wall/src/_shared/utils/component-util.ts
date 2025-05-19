import { COIN_TOSS_GAME_ID, COIN_TOSS_GAME_NAMESPACE, RNGSoccer_GAME_ID, RNGSoccer_GAME_NAMESPACE } from "../../../constant/app";
import CoinTossHeader from "../../games/saba-club/coin-toss/header"
import CoinTossPage from "../../games/saba-club/coin-toss/page"
import RNGSoccerPage from "../../games/saba-club/rng-soccer/page";

export const gamePageMap = {
    [COIN_TOSS_GAME_ID]: { component: CoinTossPage, namespace: COIN_TOSS_GAME_NAMESPACE },
    [RNGSoccer_GAME_ID]: { component: RNGSoccerPage, namespace: RNGSoccer_GAME_NAMESPACE },
};

export const gameHeaderMap = {
    [COIN_TOSS_GAME_ID]: CoinTossHeader,
    // [RNGSoccer_GAME_ID]: RNGSoccerHeader,
};