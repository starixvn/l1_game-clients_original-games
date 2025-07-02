import React from 'react'

interface TopLogoBarProps {
    loaded: boolean
    setSettingModalOpen: (open: boolean) => void
    setHistoryModalOpen: (open: boolean) => void
    setRuleModalOpen: (open: boolean) => void
}

export function TopLogoBar({
    loaded,
    setSettingModalOpen,
    setHistoryModalOpen,
    setRuleModalOpen
}: TopLogoBarProps) {
    return (
        <div className="top-logo-bar">
            <div className="logo">
                <h1>Crash Game</h1>
            </div>
            <div className="controls">
                <button onClick={() => setRuleModalOpen(true)}>Rules</button>
                <button onClick={() => setHistoryModalOpen(true)}>History</button>
                <button onClick={() => setSettingModalOpen(true)}>Settings</button>
            </div>
        </div>
    )
} 