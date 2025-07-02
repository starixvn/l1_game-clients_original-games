import React from 'react'

interface CustomSnackBarProps {
    open: boolean
    message: string
    onClose: () => void
}

export function CustomSnackBar({ open, message, onClose }: CustomSnackBarProps) {
    if (!open) return null

    return (
        <div className="custom-snackbar">
            <span>{message}</span>
            <button onClick={onClose}>×</button>
        </div>
    )
} 