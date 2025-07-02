import create from 'zustand'

interface Auth {
    auth: boolean
    balance: number
    setAuth: (auth: boolean) => void
    setBalance: (balance: number) => void
    incrementBalance: (amount: number) => void
    decrementBalance: (amount: number) => void
}

export const useAuthStore = create<Auth>((set, get) => ({
    auth: false,
    balance: 0,
    setAuth: (auth: boolean) => {
        set({ auth })
    },
    setBalance: (balance: number) => {
        set({ balance })
    },
    incrementBalance: (amount: number) => {
        const balance = get().balance
        set({ balance: balance + amount })
    },
    decrementBalance: (amount: number) => {
        const balance = get().balance
        set({ balance: Math.max(0, balance - amount) })
    }
})) 