import { WithRouterProps } from "next/dist/client/with-router";
export type ILobbyProps = {
    token?: string;
} & WithRouterProps;

export interface ILobbyState {
    isAuthorized: boolean;
    offerGames: { gameId: number }[];
}
