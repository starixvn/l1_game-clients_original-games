import React, { useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'
import axios, { AxiosError } from 'axios'
import { useAuthStore } from '../../../../../store/crash/store/auth'
import { useGameStore } from '../../../../../store/crash/store/game'
import { Game_Global_Vars, doDelay, getHistoryItemColor, showToast } from '../../../../../utils/crash'
import { BetBoard } from './BetBoard'
import { BetAutoSwitch } from './BetAutoSwitch'
import { SwitchButton } from './SwitchButton'
import { AutoBetModal } from './AutoBetModal'
import { SnackBar } from './SnackBar'
import { CustomSnackBar } from './CustomSnackBar'

interface GameBoardProps {
    bet6: string[]
    socket: Socket | null
    token: string
    incrementGamesRunning: () => void
    decrementGamesRunning: () => void
}

export function GameBoard({
    bet6,
    socket,
    token,
    incrementGamesRunning,
    decrementGamesRunning
}: GameBoardProps) {
    const { balance, setBalance } = useAuthStore()
    const { gamesRunning } = useGameStore()

    const [autoPlayingIndex, setAutoPlayingIndex] = useState(0)
    const [snackState, setSnackState] = useState({
        open: false,
        msg: ""
    })
    const [modalAutoPlayOpen, modalAutoPlaySetOpen] = useState(false)
    const [rotate, setRotate] = useState(0)
    const [trigParachute, setTrigParachute] = useState({ uniqId: 0, isMe: true })
    const [crashHistory, setCrashHistory] = useState<string[]>([])
    const [crashAnim, setCrashAnim] = useState<boolean>(false)
    const [crashColor, setCrashColor] = useState<string[]>([])
    const [pixiDimension, setPixiDimension] = useState({ width: 0, height: 400 })
    const pixi_ref = useRef<HTMLDivElement>(null)
    const footer_ref = useRef<HTMLDivElement>(null)

    const [betButtonCount, setBetButtonCount] = useState(2)
    const [curPayout, setCurPayout] = useState(0)
    const [pendingBet, setPendingBet] = useState<boolean[]>([false, false])
    const [allowedBet, setAllowedBet] = useState(false)
    const [betAutoState, setBetAutoState] = useState<("bet" | "auto")[]>(["bet", "bet"])
    const [betValue, setBetValue] = useState<string[]>([bet6[0], bet6[0]])
    const [cashedWin, setCashedWin] = useState<number[]>([0, 0])
    const [enabledAutoCashOut, setEnabledAutoCashOut] = useState<boolean[]>([false, false])
    const [autoCashVal, setAutoCashVal] = useState<string[]>(["1.45", "1.45"])
    const [betPlaceStatus, setBetPlaceStatus] = useState<("none" | "placing" | "success" | "failed")[]>(["none", "none"])
    const [cashingStatus, setCashingStatus] = useState<("none" | "caching" | "success" | "failed")[]>(["none", "none"])
    const [betBoardAllItem, setBetBoardAllItem] = useState<any[]>([])
    const [betBoardMyItem, setBetBoardMyItem] = useState<any[]>([])
    const [cashes, setCashes] = useState<{ payout: number, win: number }[]>([])

    const _setBetValue = (val: string | ((prev: string) => string), i: number) => {
        if (typeof val === "string") {
            Game_Global_Vars.betValue[i] = val
            setBetValue(prev => {
                const new_val = [...prev]
                new_val[i] = val
                return new_val
            })
        } else {
            setBetValue(prev => {
                const new_val = [...prev]
                new_val[i] = val(prev[i])
                Game_Global_Vars.betValue = new_val
                return new_val
            })
        }
    }

    const _setBetPlaceStatus = (val: any, i: number) => {
        if (typeof val === "object") {
            Game_Global_Vars.betPlaceStatus = val
            setBetPlaceStatus(val)
        } else {
            Game_Global_Vars.betPlaceStatus[i] = val
            setBetPlaceStatus(prev => {
                const newArr = [...prev]
                newArr[i] = val
                return newArr
            })
        }
    }

    const _setCashingStatus = (val: any, i: number) => {
        Game_Global_Vars.cashingStatus[i] = val
        setCashingStatus(prev => {
            const newArr = [...prev]
            newArr[i] = val
            return newArr
        })
    }

    const _setPendingBet = (val: boolean | boolean[], i: number) => {
        if (typeof val === "boolean") {
            setPendingBet(prev => {
                const newArr = [...prev]
                newArr[i] = val
                return newArr
            })
        } else {
            setPendingBet(val)
        }
    }

    const _setCashedWin = (val: number, i: number) => {
        setCashedWin(prev => {
            const newArr = [...prev]
            newArr[i] = val
            return newArr
        })
    }

    const handleBetValueChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
        if (e.target.value.endsWith('.')) {
            _setBetValue(e.target.value, i)
        } else {
            _setBetValue(Math.max(10, (Math.round(parseFloat(e.target.value) * 100) / 100)).toString(), i)
        }
    }

    const modifyBetValue = (amount: number, i: number) => {
        _setBetValue(prev => {
            const new_val = parseInt(prev)
            return `${Math.max(new_val + amount, 10)}`
        }, i)
    }

    const placeBet = async (i: number): Promise<boolean> => {
        try {
            const { data: { status, balance: newBalance, message, gameID } } = await axios.post('/api/games/crash/play/place-bet', {
                betAmount: parseFloat(betValue[i]),
                gameID: Game_Global_Vars.id[i]
            })

            if (status) {
                Game_Global_Vars.id[i] = gameID
                setBalance(newBalance)
                incrementGamesRunning()
                return true
            } else {
                showToast(message)
                return false
            }
        } catch (e) {
            if ((e as AxiosError)?.response?.status === 503) {
                document.body.innerHTML = ((e as AxiosError)?.response?.data) as string
                document.body.style.cssText = "color:white"
            }
            return false
        }
    }

    const doBet = async (i: number) => {
        if (!Game_Global_Vars.allowedBet) return
        _setBetPlaceStatus("placing", i)
        Game_Global_Vars.cashStarted[i] = false
        _setCashingStatus("none", i)
        if ((Game_Global_Vars.betPlaceStatus[0] === "placing" && i === 1) ||
            (Game_Global_Vars.betPlaceStatus[1] === "placing" && i === 0)) {
            await doDelay(1000)
        }
        const status = await placeBet(i)
        _setBetPlaceStatus(status ? "success" : "none", i)
    }

    const handleBet = async (i: number) => {
        if (Game_Global_Vars.allowedBet) {
            await doBet(i)
        } else {
            _setPendingBet(true, i)
            Game_Global_Vars.pendingBet[i] = true
        }
    }

    const cancelBet = async (i: number) => {
        if (Game_Global_Vars.pendingBet[i]) {
            _setPendingBet(false, i)
            Game_Global_Vars.pendingBet[i] = false
        } else {
            try {
                const { data: { status, balance: newBalance, message } } = await axios.post('/api/games/crash/play/cancel-bet', {
                    gameID: Game_Global_Vars.id[i]
                })
                if (status) {
                    _setBetPlaceStatus("none", i)
                    setBalance(newBalance)
                    decrementGamesRunning()
                } else {
                    showToast(message)
                }
            } catch (e) {
                showToast("Failed to cancel bet")
            }
        }
    }

    const handleCashOut = async (i: number, auto?: boolean) => {
        if (Game_Global_Vars.cashStarted[i]) return
        Game_Global_Vars.cashStarted[i] = true
        _setCashingStatus("caching", i)
        await socket?.emit(auto ? "auto-cashout" : "cashout", `crash-round-${Game_Global_Vars.id[i]}`)
    }

    const handleResize = () => {
        const width = Math.min(1920, pixi_ref.current?.clientWidth || 0)
        const height = Math.max(150, window.innerHeight - (footer_ref.current?.clientHeight || 0) - 150 - (width > 1392 ? 0 : 10))
        setPixiDimension({ width, height })
    }

    useEffect(() => {
        if (crashHistory.length === 0) {
            axios.post('/api/crash/play/recent-rec').then((data) => {
                setCrashHistory(data.data.data.map((v: any) => `${parseFloat(v.max_payout).toFixed(2)}x`))
            }).catch(e => console.error(e))
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        const interval = setInterval(() => setRotate(prev => prev + 10), 100)

        return () => {
            window.removeEventListener('resize', handleResize)
            clearInterval(interval)
        }
    }, [])

    useEffect(() => {
        setCrashColor(crashHistory.map(item => getHistoryItemColor(item)))
    }, [crashHistory])

    useEffect(() => {
        if (!socket) return

        socket.on("game-start", (data: any) => {
            Game_Global_Vars.allowedBet = true
            setAllowedBet(true)
            _setBetPlaceStatus(["none", "none"], 0)
            _setCashingStatus(["none", "none"], 0)
            _setPendingBet([false, false], 0)
            Game_Global_Vars.pendingBet = [false, false]
            Game_Global_Vars.cashStarted = [false, false]
            setCurPayout(0)
            setCrashAnim(false)
        })

        socket.on("game-crash", (data: any) => {
            Game_Global_Vars.allowedBet = false
            setAllowedBet(false)
            setCurPayout(data.crashPoint)
            setCrashAnim(true)
            setCrashHistory(prev => [data.crashPoint, ...prev.slice(0, 9)])

            // Handle game end
            decrementGamesRunning()
        })

        socket.on("cashout-success", (data: any) => {
            const { gameID, payout, win } = data
            const index = Game_Global_Vars.id.indexOf(gameID)
            if (index !== -1) {
                _setCashingStatus("success", index)
                _setCashedWin(win, index)
                setCashes(prev => [...prev, { payout, win }])
                setBalance(balance + win)
                decrementGamesRunning()
            }
        })

        return () => {
            socket.off("game-start")
            socket.off("game-crash")
            socket.off("cashout-success")
        }
    }, [socket, decrementGamesRunning])

    return (
        <div className="crash-game-board">
            <div className="game-container">
                <div ref={pixi_ref} className="pixi-container">
                    <div className="game-placeholder">
                        <h2>Crash Game</h2>
                        <p>Game is loading...</p>
                    </div>
                </div>
            </div>
        </div>
    )
} 