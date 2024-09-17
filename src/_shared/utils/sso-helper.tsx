import axios from "axios";
import appSettings from "../app-settings";

export const requestSSO = async (gameId = 0) => {
    const randomIntFromInterval = (min: number, max: number) => {
        // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const playerId = randomIntFromInterval(1000000, 9999999);
    const appType = 6;
    const playerBalance = 10000;

    const request = {
        playerId: `${playerId}`,
        playerName: `username_${playerId}`,
        language: "vi-VN",
        currency: "INH",
        seq: "d,y,lumi",
        siteId: "4100300",
        siteName: "lumi",
        ip: "10.5.10.17, 10.233.120.0",
        browserUserAgent: global?.window?.navigator?.userAgent || "",
        auth: {
            operatorId: appSettings.simulatorConfigs.operatorId,
            operatorSecret: appSettings.simulatorConfigs.operatorSecret,
        },
        operatorToken: "ONEworksVGCashToken",
        token: null,
        redirectUrl: "#",
        verifyResult: null,
        gameId,
        domain: "example.com",
        localhost: null,
        isOpenOnIframe: false,
        appType,
        isCash: true,
        partner: "1W",
        disableJackpotGames: false,
        expandAdvanceSetting: false,
        instantMode: 1,
        devIp: null,
        setDefaultBalance: false,
        ref: "",
        deeplink: "https://4qwcm.test-app.link/pPv9z8d27ub/?uri=https://gn-connectsite.lumigame.com/login",
        isApp: false,
        returnUrl: "",
        local: 0,
        resource: null,
    };

    const gameLobbySimulatorUrl = appSettings.simulatorConfigs.gameLobbySimulatorUrl;
    const ssoResult = (await axios.post(`${gameLobbySimulatorUrl}/signin/sso`, request)).data;
    await createCustomer(playerId, "ow", request.siteId);
    await assignBalance(playerId, playerBalance, request.currency, request.siteId);

    return ssoResult;
};

const assignBalance = async (playerId: number, balance: number, currency: string, siteId: string) => {
    await axios.post(
        `${appSettings.simulatorConfigs.owApiSimulatorUrl}/SetDefaultBalance?playerId=${encodeURIComponent(
            playerId
        )}&operator=ow&balance=${balance}&systemType=GN&username=username_${encodeURIComponent(
            playerId
        )}&currency=${currency}&siteId=${siteId}`
    );
};

const createCustomer = async (playerId: number, operator: string, siteId: string) => {
    await axios.post(
        `${appSettings.simulatorConfigs.owApiSimulatorUrl}/CreateCustomer?memId=${encodeURIComponent(
            playerId
        )}&operator=${operator}&systemType=GN&siteId=${siteId}`
    );
};
