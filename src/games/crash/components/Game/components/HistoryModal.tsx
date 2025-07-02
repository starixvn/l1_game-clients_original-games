import React from 'react'

interface HistoryModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    loaded: boolean
}

export function HistoryModal({ open, setOpen, loaded }: HistoryModalProps) {
    if (!open) return null

    return (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Game History</h3>
                <div className="history-content">
                    <p>History functionality coming soon...</p>
                </div>
                <button onClick={() => setOpen(false)}>Close</button>
            </div>
        </div>
    )
} 