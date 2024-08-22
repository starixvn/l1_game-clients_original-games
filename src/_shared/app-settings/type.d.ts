import { GameSettings } from "../../components/game-base/type";

interface ProxySetting {
    ssl: string;
    subDomain: string;
    path: string;
}

interface SentryOptions {
    dsn: string;
    environment: string;
}

export default interface AppSettings {
    serverDomainMapper: Array<string>;
    socketGatewayPath: string;
    proxy: ProxySetting;
    sentry: SentryOptions;
    gameSettings: { [id: string]: GameSettings };
    enableMsgpackParser: boolean;
    system: string;
    gamePath: string;
    resourceUrl: string;
    gameSettingUrl: string;
    gameLobbySimulatorUrl: string;
}
