import React from 'react'

interface BetAutoSwitchProps {
    betAutoState: "bet" | "auto"
    setBetAutoState: (state: "bet" | "auto") => void
}

export function BetAutoSwitch({ betAutoState, setBetAutoState }: BetAutoSwitchProps) {
    return (
        <div className="bet-auto-switch">
            <button
                className={betAutoState === "bet" ? "active" : ""}
                onClick={() => setBetAutoState("bet")}
            >
                Bet
            </button>
            <button
                className={betAutoState === "auto" ? "active" : ""}
                onClick={() => setBetAutoState("auto")}
            >
                Auto
            </button>
        </div>
    )
} 