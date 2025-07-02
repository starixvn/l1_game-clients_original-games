import React from 'react'

interface SplashProps {
    loaded: boolean
    setOpenGame: (open: boolean) => void
}

export function Splash({ loaded, setOpenGame }: SplashProps) {
    return (
        <div className="splash-screen">
            <div className="splash-content">
                <h1>Crash Game</h1>
                <p>Ready to play?</p>
                <button
                    onClick={() => setOpenGame(true)}
                    disabled={!loaded}
                >
                    {loaded ? 'Start Game' : 'Loading...'}
                </button>
            </div>
        </div>
    )
} 