import { WithRouterProps } from "next/dist/client/with-router";

export interface GameConfigs {
    odds: { [key: string]: number };
    minBet: number;
    maxBet: number;
    maxBetPerChoices: any;
    enableFreeBet: boolean;
    margin: any;
    chips: string[];
}

export type GamePropsContext = {
    id?: number;
    tolgeeNamespace?: string;
    gameName?: string;
};

export type GameBaseProps = GamePropsContext & WithRouterProps;
