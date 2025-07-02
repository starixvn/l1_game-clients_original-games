import React from 'react'

interface SnackBarProps {
    open: boolean
    message: string
    onClose: () => void
}

export function SnackBar({ open, message, onClose }: SnackBarProps) {
    if (!open) return null

    return (
        <div className="snackbar">
            <span>{message}</span>
            <button onClick={onClose}>×</button>
        </div>
    )
} 