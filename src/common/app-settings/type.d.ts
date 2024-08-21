import { WithRouterProps } from "next/dist/client/with-router";

export type GameSettingProps = {
    id: number;
    gameName: string;
} & WithRouterProps;

interface ProxySetting {
    ssl: string;
    uri: string;
    path: string;
}

interface SentryOptions {
    dsn: string;
    environment: string;
}
export default interface AppSettings {
    proxy: ProxySetting;
    sentry: SentryOptions;
    gameSettings: { [id: string]: GameSettingProps };
    system: string;
    resourceUrl: string;
    gameSettingUrl: string;
    gameLobbySimulatorUrl: string;

    useTolgeeStatic: boolean;
}
