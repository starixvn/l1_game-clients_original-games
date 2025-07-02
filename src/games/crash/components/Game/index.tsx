import React, { useState, useEffect } from 'react'
import axios, { AxiosError } from 'axios'
import io from 'socket.io-client'
import { Assets } from 'pixi.js'
import { useGameStore } from '../../../../store/crash/store/game'
import { useAuthStore } from '../../../../store/crash/store/auth'
import { urls } from '../../../../utils/crash/urls'
import { Game_Global_Vars, initBet6, loadSound } from '../../../../utils/crash'
import { buildServerUrl } from '../../../../helpers/crash/url-helper'
import MsgpackParser from "socket.io-msgpack-parser"
import { getAppSettings } from '../../../../common/crash/app-settings'

import { BetBoard } from './components/BetBoard'
import { GameBoard } from './components/GameBoard'
import { TopLogoBar } from './components/TopLogoBar'
import { RuleModal } from './components/RuleModal'
import { SettingModal } from './components/SettingModal'
import { HistoryModal } from './components/HistoryModal'
import { AccessDenied } from './components/AccessDenied'
import { Splash } from './components/Splash'

export function Game() {
    const { auth, balance, setAuth, setBalance } = useAuthStore()
    const { incrementGamesRunning, decrementGamesRunning } = useGameStore()

    const [loaded, setLoaded] = useState(false)
    const [openGame, setOpenGame] = useState(false)
    const [bet6, setBet6] = useState<string[]>(initBet6)
    const [ruleModalOpen, setRuleModalOpen] = useState(false)
    const [settingModalOpen, setSettingModalOpen] = useState(false)
    const [historyModalOpen, setHistoryModalOpen] = useState(false)
    const [socket, setSocket] = useState<any>(null)
    const [token, setToken] = useState("")

    useEffect(() => {
        Game_Global_Vars.betValue = [bet6[0], bet6[0]]
    }, [bet6])

    useEffect(() => {
        Assets.load(urls).then(() => {
            (async () => {
                const urlParams = new URLSearchParams(window.location.search);
                const tokenParam: string = urlParams.get('token') || "";
                if (!tokenParam) {
                    setAuth(false)
                    return
                }

                delete axios.defaults.headers.common['Accept']
                axios.defaults.headers.common['token'] = tokenParam;
                axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || "https://apiuat.bollygaming.games"
                axios.defaults.timeout = 20000

                try {
                    await axios.post('/api/config').then((response) => {
                        localStorage.setItem('bet6', JSON.stringify(response.data.data.config.chips.slice(0, 6).map((item: number) => (`${item}`))))
                        Game_Global_Vars.stake = {
                            max: response.data.data.maxStake,
                            min: response.data.data.minStake
                        }
                        setBalance(response.data.data.user.account.balance)
                    })

                    const { data: { hash } }: { data: { hash: string } } = await axios.post('/api/user/games/create', {
                        game_package_id: "crash",
                        client_seed: Math.ceil(Math.random() * 99999999)
                    })
                    Game_Global_Vars.hash = hash

                    const socketInfo = {
                        namespace: "spaceflight",
                        path: "spaceflight"
                    }
                    const socketUri = buildServerUrl(socketInfo.namespace);
                    const { proxy, enableMsgpackParser } = getAppSettings();

                    const socketInstance = io(socketUri, {
                        transports: ["websocket"],
                        upgrade: false,
                        path: `${proxy.path}/${socketInfo.path}/socket.io`,
                        parser: MsgpackParser,
                    });

                    setSocket(socketInstance)
                    setToken(tokenParam)

                    socketInstance.on('connect', () => {
                        console.log('Connected to the server!');
                    });
                    socketInstance.on("signedIn", () => {
                        setAuth(true);
                        socketInstance.emit("inGame");
                    });
                    socketInstance.on('disconnect', () => {
                        console.log('Disconnected from the server!');
                    });
                    setLoaded(true)
                } catch (e) {
                    if ((e as AxiosError)?.response?.status === 503) {
                        document.body.innerHTML = ((e as AxiosError)?.response?.data) as string
                        document.body.style.cssText = "color:white"
                    }
                    setAuth(false)
                }
            })()

            loadSound()
        });

        return () => {
            socket?.removeAllListeners()
            socket?.disconnect();
        }
    }, [])

    return (
        <>
            <TopLogoBar
                loaded={loaded}
                setSettingModalOpen={setSettingModalOpen}
                setHistoryModalOpen={setHistoryModalOpen}
                setRuleModalOpen={setRuleModalOpen}
            />
            {
                auth ?
                    (openGame && loaded ?
                        <GameBoard
                            bet6={bet6}
                            socket={socket}
                            token={token}
                            incrementGamesRunning={incrementGamesRunning}
                            decrementGamesRunning={decrementGamesRunning}
                        />
                        :
                        <Splash loaded={loaded} setOpenGame={setOpenGame} />)
                    :
                    <AccessDenied />
            }
            <RuleModal open={ruleModalOpen} setOpen={setRuleModalOpen} />
            <SettingModal open={settingModalOpen} setOpen={setSettingModalOpen} bet6={{ bet6, setBet6 }} />
            <HistoryModal loaded={loaded} open={historyModalOpen} setOpen={setHistoryModalOpen} />
        </>
    )
} 