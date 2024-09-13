import { WithRouterProps } from "next/dist/client/with-router";
import { CurrentGameConnectedType } from "../_shared/states/lobby";
export type ILobbyProps = {
    token?: string;
} & WithRouterProps;

export interface ILobbyState {
    isAuthorized: boolean;
    offerGames: { gameId: number }[];
    connectedCount: number;
}
