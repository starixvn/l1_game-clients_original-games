import React from 'react'

interface SwitchButtonProps {
    checked: boolean
    onChange: (checked: boolean) => void
}

export function SwitchButton({ checked, onChange }: SwitchButtonProps) {
    return (
        <div
            className={`switch-button ${checked ? 'checked' : ''}`}
            onClick={() => onChange(!checked)}
        >
            <div className="switch-slider" />
        </div>
    )
} 