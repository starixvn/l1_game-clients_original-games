import React from 'react'

interface SettingModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    bet6: { bet6: string[], setBet6: (bet6: string[]) => void }
}

export function SettingModal({ open, setOpen, bet6 }: SettingModalProps) {
    if (!open) return null

    return (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Game Settings</h3>
                <div className="settings-content">
                    <p>Settings functionality coming soon...</p>
                </div>
                <button onClick={() => setOpen(false)}>Close</button>
            </div>
        </div>
    )
} 