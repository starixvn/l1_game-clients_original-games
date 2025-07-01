import { produce } from 'immer'
import toast from 'react-hot-toast'
import create from 'zustand'

interface Wallet {
  balance: number
}

interface State {
  wallet: Wallet
  isWalletLoading: boolean
  setBalance: (balance: number) => void
  incrementBalance: (amount: number) => void
  decrementBalance: (amount: number) => void
}

// Hard-coded balance for demo purposes
// This allows players to input bet amounts and play the game without authentication
const HARD_CODED_BALANCE = 10000 // $10,000 starting balance

function getHardCodedBalance(): number {
  return HARD_CODED_BALANCE
}

const walletInitialState: Wallet = {
  balance: getHardCodedBalance() // Initialize with hard-coded balance
}

export const useAuthStore = create<State>((setState, getState) => ({
  wallet: walletInitialState,
  isWalletLoading: false,
  setBalance: (balance: number) => {
    try {
      setState(
        produce<State>(state => {
          state.wallet.balance = balance
          state.isWalletLoading = false
        })
      )
      // Balance is hard-coded, no need to persist to localStorage
    } catch (error) {
      toast.error('An error occurred while updating the balance')
      console.error('setBalanceError', error)
    }
  },
  incrementBalance: (amount: number) => {
    try {
      setState(state => ({ ...state, isWalletLoading: true }))
      const currentBalance = getState().wallet.balance
      const newBalance = currentBalance + amount
      getState().setBalance(newBalance)
      setState(state => ({ ...state, isWalletLoading: false }))
    } catch (error) {
      toast.error('An error occurred while updating the balance')
      console.error('incrementBalanceError', error)
    }
  },
  decrementBalance: (amount: number) => {
    try {
      setState(state => ({ ...state, isWalletLoading: true }))
      const currentBalance = getState().wallet.balance
      const newBalance = Math.max(0, currentBalance - amount) // Prevent negative balance

      // If balance reaches zero, reset to hard-coded balance for demo purposes
      if (newBalance === 0) {
        getState().setBalance(HARD_CODED_BALANCE)
      } else {
        getState().setBalance(newBalance)
      }

      setState(state => ({ ...state, isWalletLoading: false }))
    } catch (error) {
      toast.error('An error occurred while updating the balance')
      console.error('decrementBalanceError', error)
    }
  }
}))
