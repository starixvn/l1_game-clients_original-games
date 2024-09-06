interface SentryOptions {
    dsn: string;
    environment: string;
}

interface IGameSettings {
    id: number;
    gameName: string;
    name: string;
    namespaces: string[];
    durations: {
        wholeRound: number;
        lockingBet: number;
        placingBet: number;
        generatingResult: number;
        showingResult: number;
        startRound: number;
    };
    numberOfRoundHistory: number;
    websocket: {
        proxyPath: string;
        route: string;
    };
    mainObserverNamespace: string;
    storagePrefixKey: string;
}

export default interface AppSettings {
    serverDomain: string;
    socketGatewayPath: string;
    sentry: SentryOptions;
    gameSettings: { [id: string]: IGameSettings };
    enableMsgpackParser: boolean;
    enableMsgpackParserOnNotification: boolean;
    systemType: string;
    gamePath: string;
    gameSettingUrl: string;
    gameLobbySimulatorUrl: string;
    ssl: boolean;
    subDomain: string;
    env: string;
    enableMsgpackParserAllGames: boolean;
    owApiSimulatorUrl: string;
    subDirectory: string;
    operatorId: string;
    operatorSecret: string;
}
