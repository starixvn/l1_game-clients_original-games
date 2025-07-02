import React from 'react'

interface BetBoardProps {
    crashHistory: string[]
    crashColor: string[]
    betBoardAllItem: any[]
    betBoardMyItem: any[]
}

export function BetBoard({
    crashHistory,
    crashColor,
    betBoardAllItem,
    betBoardMyItem
}: BetBoardProps) {
    return (
        <div className="bet-board">
            <div className="crash-history">
                <h3>Recent Crashes</h3>
                <div className="history-items">
                    {crashHistory.slice(0, 10).map((crash, index) => (
                        <div
                            key={index}
                            className="history-item"
                            style={{ backgroundColor: crashColor[index] || '#07BDE5' }}
                        >
                            {crash}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 