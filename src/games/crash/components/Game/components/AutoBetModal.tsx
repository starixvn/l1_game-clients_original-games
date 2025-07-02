import React from 'react'

interface AutoBetModalProps {
    open: boolean
    onClose: () => void
}

export function AutoBetModal({ open, onClose }: AutoBetModalProps) {
    if (!open) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Auto Bet Settings</h3>
                <p>Auto bet functionality coming soon...</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    )
} 