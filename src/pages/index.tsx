import axios from "axios";
import { useEffect, useState } from "react";
import appSettings from "../common/app-settings";

const randomIntFromInterval = (min: number, max: number) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const doSSO = async () => {
    const playerId = randomIntFromInterval(1000, 99999);
    const appType = 2;
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
        gameId: 0,
        domain: "example.com",
        appType: appType,
        partner: "1W",
        disableJackpotGames: false,
        operatorToken: "ONEworks1Token",
    };

    const gameLobbySimulatorUrl = appSettings.gameLobbySimulatorUrl;
    const ssoResult = (await axios.post(`${gameLobbySimulatorUrl}/signin/sso`, request)).data;
    return ssoResult?.token;
};

const Demo = () => {
    doSSO();

    const [token, setToken] = useState("");

    useEffect(() => {
        const call = async () => {
            const token = await doSSO();
            setToken(token);
        };
        call();
    }, []);
    return <div>token: {token}</div>;
};

export default Demo;
