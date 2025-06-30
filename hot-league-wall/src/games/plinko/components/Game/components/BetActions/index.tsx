import React, { ChangeEvent, useState } from 'react'
import { CurrencyDollarSimple, Smiley } from 'phosphor-react'
import { useAuthStore } from '../../../../../../store/plinko/store/auth'

import { LinesType } from '../../@types'

interface PlinkoBetActions {
  onRunBet: (betValue: number) => void
  onChangeLines: (lines: LinesType) => void
  inGameBallsCount: number
}

export function BetActions({
  onRunBet,
  onChangeLines,
  inGameBallsCount
}: PlinkoBetActions) {
  const isLoading = useAuthStore(state => state.isWalletLoading)
  const currentBalance = useAuthStore(state => state.wallet.balance)
  const decrementCurrentBalance = useAuthStore(state => state.decrementBalance)
  const [betValue, setBetValue] = useState(0)
  const maxLinesQnt = 16
  const linesOptions: number[] = []
  for (let i = 8; i <= maxLinesQnt; i++) {
    linesOptions.push(i)
  }

  function handleChangeBetValue(e: ChangeEvent<HTMLInputElement>) {
    if (isLoading) return
    e.preventDefault()
    const value = +e.target.value
    const newBetValue = value >= currentBalance ? currentBalance : value
    setBetValue(newBetValue)
  }

  function handleChangeLines(e: ChangeEvent<HTMLSelectElement>) {
    if (isLoading) return

    onChangeLines(Number(e.target.value) as LinesType)
  }

  function handleHalfBet() {
    if (isLoading) return
    const value = betValue / 2
    const newBetvalue = value <= 0 ? 0 : Math.floor(value)
    setBetValue(newBetvalue)
  }

  function handleDoubleBet() {
    if (isLoading) return
    const value = betValue * 2

    if (value >= currentBalance) {
      setBetValue(currentBalance)
      return
    }

    const newBetvalue = value <= 0 ? 0 : Math.floor(value)
    setBetValue(newBetvalue)
  }

  function handleMaxBet() {
    if (isLoading) return
    setBetValue(currentBalance)
  }

  async function handleRunBet() {
    if (isLoading) return
    if (inGameBallsCount >= 15) return
    if (betValue > currentBalance) {
      setBetValue(currentBalance)
      return
    }
    onRunBet(betValue)
    if (betValue <= 0) return
    await decrementCurrentBalance(betValue)
  }

  return (
    <div className="plinko-bet-actions">
      <span className="balls-in-game">
        *balls in game {inGameBallsCount}/15
      </span>

      <div className="bet-container">
        <div className="bet-input-group">
          <div className="bet-input-row">
            <div className="bet-amount-container">
              <div className="bet-amount-header">
                <span>Bet amount</span>
                <div className="bet-amount-display">
                  <div className="currency-icon">
                    <CurrencyDollarSimple weight="bold" />
                  </div>
                  <span>{betValue.toFixed(2)}</span>
                </div>
              </div>
              <div className="bet-input-wrapper">
                <input
                  type="number"
                  min={0}
                  max={currentBalance}
                  onChange={handleChangeBetValue}
                  value={betValue}
                  className="bet-input"
                />
                <button
                  onClick={handleHalfBet}
                  className="bet-button half"
                >
                  ½
                </button>
                <button
                  onClick={handleDoubleBet}
                  className="bet-button double"
                >
                  2x
                </button>
                <button
                  onClick={handleMaxBet}
                  className="bet-button max"
                >
                  max
                </button>
              </div>
            </div>

            <button
              onClick={handleRunBet}
              disabled={isLoading}
              className="bet-button-mobile"
            >
              Bet
            </button>
          </div>
          <select
            disabled={inGameBallsCount > 0}
            onChange={handleChangeLines}
            defaultValue={16}
            className="lines-select"
            id="lines"
          >
            {linesOptions.map(line => (
              <option key={line} value={line}>
                {line} Lines
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleRunBet}
          disabled={isLoading}
          className="bet-button-desktop"
        >
          Bet
        </button>
      </div>
    </div>
  )
}
