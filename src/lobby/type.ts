import { WithRouterProps } from "next/dist/client/with-router";
export type ILobbyProps = {
    token?: string;
} & WithRouterProps;

export interface ILobbyStates {
    isAuthorized: boolean;
    namespace: string;
    system: number;
}
