export interface IOfferGame {
    gameId: number;
    minBet: number;
    maxBet: number;
    maxBetPerChoices: object;
}

export interface ILobbyState {
    offerGames: { gameId: number }[];
    isRenderGame: boolean;
    leagueToogle: boolean;
    expandedGames: { [key: string]: boolean };
    isAuthorized: boolean;
    selectedGameId: number | null;
}
