import React from 'react'

interface RuleModalProps {
    open: boolean
    setOpen: (open: boolean) => void
}

export function RuleModal({ open, setOpen }: RuleModalProps) {
    if (!open) return null

    return (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Game Rules</h3>
                <div className="rules-content">
                    <p>1. Place your bet before the game starts</p>
                    <p>2. Watch the multiplier increase</p>
                    <p>3. Cash out before the crash to win</p>
                    <p>4. If you don't cash out in time, you lose your bet</p>
                </div>
                <button onClick={() => setOpen(false)}>Close</button>
            </div>
        </div>
    )
} 