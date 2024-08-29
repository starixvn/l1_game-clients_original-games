import axios from "axios";
import appSettings from "../../common/app-settings";

export const requestSSO = async (gameId = 0) => {
    const randomIntFromInterval = (min: number, max: number) => {
        // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const playerId = randomIntFromInterval(1000, 99999);
    const appType = 1;
    const playerBalance = 10000;
    const request = {
        playerId: playerId,
        playerName: `username_${playerId}`,
        language: "en-US",
        currency: "$US",
        seq: "d,y,lumi",
        siteId: "4100300",
        siteName: "lumi",
        ip: "",
        browserUserAgent: global?.window?.navigator?.userAgent || "",
        auth: {
            operatorId: "ONEworks1",
            operatorSecret: "ONEworks1@20luminet&",
        },
        gameId: gameId,
        domain: "example.com",
        appType: appType,
        partner: "1W",
        disableJackpotGames: false,
        operatorToken: "ONEworks1Token",
    };

    const gameLobbySimulatorUrl = appSettings.gameLobbySimulatorUrl;
    const ssoResult = (await axios.post(`${gameLobbySimulatorUrl}/signin/sso`, request)).data;
    await createCustomer(playerId, "ow", request.siteId);
    await assignBalance(playerId, playerBalance, request.currency, request.siteId);

    return ssoResult;
};

const assignBalance = async (playerId: number, balance: number, currency: string, siteId: string) => {
    await axios.post(
        `${appSettings.owApiSimulatorUrl}/SetDefaultBalance?playerId=${encodeURIComponent(
            playerId
        )}&operator=ow&balance=${balance}&systemType=SC1&username=username_${encodeURIComponent(
            playerId
        )}&currency=${currency}&siteId=${siteId}`
    );
};

const createCustomer = async (playerId: number, operator: string, siteId: string) => {
    await axios.post(
        `${appSettings.owApiSimulatorUrl}/CreateCustomer?memId=${encodeURIComponent(
            playerId
        )}&operator=${operator}&systemType=SC1&siteId=${siteId}`
    );
};
