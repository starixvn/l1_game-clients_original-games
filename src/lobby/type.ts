import { WithRouterProps } from "next/dist/client/with-router";
export type ILobbyProps = {
    token?: string;
} & WithRouterProps;

export interface ILobbyState {
    isViewOnly: boolean;
    offerGames: { gameId: number }[];
    isRenderGame: boolean;
}
