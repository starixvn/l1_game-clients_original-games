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

// Local storage key for balance
const LOCAL_BALANCE_KEY = 'plinko_local_balance'

function getLocalBalance(): number {
  if (typeof window === 'undefined') {
    return 1000 // Default starting balance for SSR
  }
  const stored = localStorage.getItem(LOCAL_BALANCE_KEY)
  return stored ? parseFloat(stored) : 1000 // Default starting balance
}

function setLocalBalance(balance: number) {
  if (typeof window === 'undefined') {
    return // Don't try to access localStorage during SSR
  }
  localStorage.setItem(LOCAL_BALANCE_KEY, balance.toString())
}

const walletInitialState: Wallet = {
  balance: getLocalBalance() // Initialize with local balance
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
      setLocalBalance(balance)
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
      getState().setBalance(newBalance)
      setState(state => ({ ...state, isWalletLoading: false }))
    } catch (error) {
      toast.error('An error occurred while updating the balance')
      console.error('decrementBalanceError', error)
    }
  }
}))
