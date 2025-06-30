import React from 'react'

interface MultiplierHistoryProps {
  multiplierHistory: number[]
}
export function MultiplierHistory({
  multiplierHistory
}: MultiplierHistoryProps) {
  return (
    <div className="plinko-multiplier-history">
      {multiplierHistory.map((multiplier, index) => {
        if (index > 3 || !multiplier) return null
        return (
          <span
            key={`${multiplier}${index}${Math.random()}`}
            className="multiplier-item"
          >
            {multiplier}x
          </span>
        )
      })}
    </div>
  )
}
