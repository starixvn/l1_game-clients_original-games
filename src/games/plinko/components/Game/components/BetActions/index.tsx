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
  const [isInputFocused, setIsInputFocused] = useState(false)
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

  const isBetDisabled = isLoading || inGameBallsCount >= 15 || betValue <= 0 || betValue > currentBalance
  const betButtonText = isLoading ? 'Loading...' : inGameBallsCount >= 15 ? 'Max Balls' : betValue <= 0 ? 'Enter Bet' : betValue > currentBalance ? 'Insufficient' : 'Bet'

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
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  value={betValue}
                  className="bet-input"
                  placeholder="0.00"
                  disabled={isLoading}
                  aria-label="Bet amount"
                />
                <button
                  onClick={handleHalfBet}
                  className="bet-button half"
                  disabled={isLoading}
                  aria-label="Half bet"
                  title="Half bet"
                >
                  ½
                </button>
                <button
                  onClick={handleDoubleBet}
                  className="bet-button double"
                  disabled={isLoading}
                  aria-label="Double bet"
                  title="Double bet"
                >
                  2x
                </button>
                <button
                  onClick={handleMaxBet}
                  className="bet-button max"
                  disabled={isLoading}
                  aria-label="Maximum bet"
                  title="Maximum bet"
                >
                  max
                </button>
              </div>
            </div>

            <button
              onClick={handleRunBet}
              disabled={isBetDisabled}
              className="bet-button-mobile"
              aria-label={betButtonText}
            >
              {betButtonText}
            </button>
          </div>
          <select
            disabled={inGameBallsCount > 0 || isLoading}
            onChange={handleChangeLines}
            defaultValue={16}
            className="lines-select"
            id="lines"
            aria-label="Number of lines"
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
          disabled={isBetDisabled}
          className="bet-button-desktop"
          aria-label={betButtonText}
        >
          {betButtonText}
        </button>
      </div>
    </div>
  )
}
