import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BetActions } from '../../../src/games/plinko/components/Game/components/BetActions'
import { useAuthStore } from '../../../src/store/plinko/store/auth'

// Mock the auth store
jest.mock('../../../src/store/plinko/store/auth', () => ({
    useAuthStore: jest.fn()
}))

// Mock phosphor-react icons
jest.mock('phosphor-react', () => ({
    CurrencyDollarSimple: ({ weight }: { weight: string }) => <div data-testid="currency-icon" data-weight={weight}>$</div>,
    Smiley: () => <div data-testid="smiley-icon">😊</div>
}))

describe('BetActions Component', () => {
    // Mock functions
    const mockOnRunBet = jest.fn()
    const mockOnChangeLines = jest.fn()

    // Default props
    const defaultProps = {
        onRunBet: mockOnRunBet,
        onChangeLines: mockOnChangeLines,
        inGameBallsCount: 0
    }

    beforeEach(() => {
        jest.clearAllMocks()
            // Reset store state
            ; (useAuthStore as jest.Mock).mockImplementation((selector) => {
                const state = {
                    isWalletLoading: false,
                    wallet: { balance: 1000 },
                    decrementBalance: jest.fn()
                }
                return selector(state)
            })
    })

    describe('Component Rendering', () => {
        it('should render the component with all elements', () => {
            render(<BetActions {...defaultProps} />)

            // Check if main elements are rendered
            expect(screen.getByText('Bet amount')).toBeInTheDocument()
            expect(screen.getByText('*balls in game 0/15')).toBeInTheDocument()
            expect(screen.getByDisplayValue('0.00')).toBeInTheDocument()
            expect(screen.getByRole('button', { name: 'Enter Bet' })).toBeInTheDocument()
        })

        it('should render the input with correct initial value', () => {
            render(<BetActions {...defaultProps} />)

            const input = screen.getByDisplayValue('0.00')
            expect(input).toBeInTheDocument()
            expect(input).toHaveAttribute('type', 'number')
            expect(input).toHaveAttribute('min', '0')
            expect(input).toHaveAttribute('max', '1000')
            expect(input).toHaveAttribute('placeholder', '0.00')
        })

        it('should render all bet action buttons', () => {
            render(<BetActions {...defaultProps} />)

            expect(screen.getByRole('button', { name: 'Half bet' })).toBeInTheDocument()
            expect(screen.getByRole('button', { name: 'Double bet' })).toBeInTheDocument()
            expect(screen.getByRole('button', { name: 'Maximum bet' })).toBeInTheDocument()
        })

        it('should render lines select with correct options', () => {
            render(<BetActions {...defaultProps} />)

            const select = screen.getByRole('combobox')
            expect(select).toBeInTheDocument()
            expect(select).toHaveValue('16')

            // Check if all line options are present (8-16)
            for (let i = 8; i <= 16; i++) {
                expect(screen.getByText(`${i} Lines`)).toBeInTheDocument()
            }
        })
    })

    describe('Input Value Handling', () => {
        it('should update input value when user types', async () => {
            const user = userEvent.setup()
            render(<BetActions {...defaultProps} />)

            const input = screen.getByDisplayValue('0.00')
            await user.clear(input)
            await user.type(input, '100')

            expect(input).toHaveValue(100)
        })

        it('should handle decimal input correctly', async () => {
            const user = userEvent.setup()
            render(<BetActions {...defaultProps} />)

            const input = screen.getByDisplayValue('0.00')
            await user.clear(input)
            await user.type(input, '50.50')

            expect(input).toHaveValue(50.5)
        })

        it('should cap input value at current balance', async () => {
            const user = userEvent.setup()
            render(<BetActions {...defaultProps} />)

            const input = screen.getByDisplayValue('0.00')
            await user.clear(input)
            await user.type(input, '1500') // Higher than balance of 1000

            expect(input).toHaveValue(1000) // Should be capped at balance
        })

        it('should handle negative input by setting to 0', async () => {
            const user = userEvent.setup()
            render(<BetActions {...defaultProps} />)

            const input = screen.getByDisplayValue('0.00')
            await user.clear(input)
            await user.type(input, '-100')

            expect(input).toHaveValue(0)
        })
    })

    describe('Bet Action Buttons', () => {
        it('should handle half bet correctly', async () => {
            const user = userEvent.setup()
            render(<BetActions {...defaultProps} />)

            // First set a bet value
            const input = screen.getByDisplayValue('0.00')
            await user.clear(input)
            await user.type(input, '100')

            // Click half bet
            const halfButton = screen.getByRole('button', { name: 'Half bet' })
            await user.click(halfButton)

            expect(input).toHaveValue(50)
        })

        it('should handle double bet correctly', async () => {
            const user = userEvent.setup()
            render(<BetActions {...defaultProps} />)

            // First set a bet value
            const input = screen.getByDisplayValue('0.00')
            await user.clear(input)
            await user.type(input, '100')

            // Click double bet
            const doubleButton = screen.getByRole('button', { name: 'Double bet' })
            await user.click(doubleButton)

            expect(input).toHaveValue(200)
        })

        it('should handle max bet correctly', async () => {
            const user = userEvent.setup()
            render(<BetActions {...defaultProps} />)

            const maxButton = screen.getByRole('button', { name: 'Maximum bet' })
            await user.click(maxButton)

            const input = screen.getByDisplayValue('1000.00')
            expect(input).toHaveValue(1000)
        })

        it('should cap double bet at current balance', async () => {
            const user = userEvent.setup()
            render(<BetActions {...defaultProps} />)

            // Set bet value to 600
            const input = screen.getByDisplayValue('0.00')
            await user.clear(input)
            await user.type(input, '600')

            // Click double bet (should be 1200, but capped at 1000)
            const doubleButton = screen.getByRole('button', { name: 'Double bet' })
            await user.click(doubleButton)

            expect(input).toHaveValue(1000)
        })
    })

    describe('Bet Button States', () => {
        it('should disable bet button when bet value is 0', () => {
            render(<BetActions {...defaultProps} />)

            const betButton = screen.getByRole('button', { name: 'Enter Bet' })
            expect(betButton).toBeDisabled()
        })

        it('should enable bet button when bet value is greater than 0', async () => {
            const user = userEvent.setup()
            render(<BetActions {...defaultProps} />)

            const input = screen.getByDisplayValue('0.00')
            await user.clear(input)
            await user.type(input, '100')

            const betButton = screen.getByRole('button', { name: 'Bet' })
            expect(betButton).not.toBeDisabled()
        })

        it('should disable bet button when loading', () => {
            ; (useAuthStore as jest.Mock).mockImplementation((selector) => {
                const state = {
                    isWalletLoading: true,
                    wallet: { balance: 1000 },
                    decrementBalance: jest.fn()
                }
                return selector(state)
            })

            render(<BetActions {...defaultProps} />)

            const betButton = screen.getByRole('button', { name: 'Loading...' })
            expect(betButton).toBeDisabled()
        })

        it('should disable bet button when max balls reached', () => {
            render(<BetActions {...defaultProps} inGameBallsCount={15} />)

            const betButton = screen.getByRole('button', { name: 'Max Balls' })
            expect(betButton).toBeDisabled()
        })

        it('should show "Insufficient" when bet exceeds balance', async () => {
            const user = userEvent.setup()
            render(<BetActions {...defaultProps} />)

            const input = screen.getByDisplayValue('0.00')
            await user.clear(input)
            await user.type(input, '1500') // Higher than balance

            const betButton = screen.getByRole('button', { name: 'Insufficient' })
            expect(betButton).toBeDisabled()
        })
    })

    describe('Lines Selection', () => {
        it('should call onChangeLines when lines are changed', async () => {
            const user = userEvent.setup()
            render(<BetActions {...defaultProps} />)

            const select = screen.getByRole('combobox')
            await user.selectOptions(select, '12')

            expect(mockOnChangeLines).toHaveBeenCalledWith(12)
        })

        it('should disable lines select when balls are in game', () => {
            render(<BetActions {...defaultProps} inGameBallsCount={5} />)

            const select = screen.getByRole('combobox')
            expect(select).toBeDisabled()
        })

        it('should disable lines select when loading', () => {
            ; (useAuthStore as jest.Mock).mockImplementation((selector) => {
                const state = {
                    isWalletLoading: true,
                    wallet: { balance: 1000 },
                    decrementBalance: jest.fn()
                }
                return selector(state)
            })

            render(<BetActions {...defaultProps} />)

            const select = screen.getByRole('combobox')
            expect(select).toBeDisabled()
        })
    })

    describe('Run Bet Functionality', () => {
        it('should call onRunBet when bet button is clicked', async () => {
            const user = userEvent.setup()
            render(<BetActions {...defaultProps} />)

            // Set bet value
            const input = screen.getByDisplayValue('0.00')
            await user.clear(input)
            await user.type(input, '100')

            // Click bet button
            const betButton = screen.getByRole('button', { name: 'Bet' })
            await user.click(betButton)

            expect(mockOnRunBet).toHaveBeenCalledWith(100)
        })

        it('should not call onRunBet when bet value is 0', async () => {
            const user = userEvent.setup()
            render(<BetActions {...defaultProps} />)

            // Try to click bet button with 0 bet value
            const betButton = screen.getByRole('button', { name: 'Enter Bet' })
            await user.click(betButton)

            expect(mockOnRunBet).not.toHaveBeenCalled()
        })

        it('should not call onRunBet when max balls reached', async () => {
            const user = userEvent.setup()
            render(<BetActions {...defaultProps} inGameBallsCount={15} />)

            // Set bet value
            const input = screen.getByDisplayValue('0.00')
            await user.clear(input)
            await user.type(input, '100')

            // Try to click bet button
            const betButton = screen.getByRole('button', { name: 'Max Balls' })
            await user.click(betButton)

            expect(mockOnRunBet).not.toHaveBeenCalled()
        })

        it('should call decrementBalance when bet is placed', async () => {
            const mockDecrementBalance = jest.fn()
                ; (useAuthStore as jest.Mock).mockImplementation((selector) => {
                    const state = {
                        isWalletLoading: false,
                        wallet: { balance: 1000 },
                        decrementBalance: mockDecrementBalance
                    }
                    return selector(state)
                })

            const user = userEvent.setup()
            render(<BetActions {...defaultProps} />)

            // Set bet value
            const input = screen.getByDisplayValue('0.00')
            await user.clear(input)
            await user.type(input, '100')

            // Click bet button
            const betButton = screen.getByRole('button', { name: 'Bet' })
            await user.click(betButton)

            await waitFor(() => {
                expect(mockDecrementBalance).toHaveBeenCalledWith(100)
            })
        })
    })

    describe('Input Focus and Blur', () => {
        it('should handle input focus correctly', async () => {
            const user = userEvent.setup()
            render(<BetActions {...defaultProps} />)

            const input = screen.getByDisplayValue('0.00')
            await user.click(input)

            expect(input).toHaveFocus()
        })

        it('should handle input blur correctly', async () => {
            const user = userEvent.setup()
            render(<BetActions {...defaultProps} />)

            const input = screen.getByDisplayValue('0.00')
            await user.click(input)
            await user.tab() // Move focus away

            expect(input).not.toHaveFocus()
        })
    })

    describe('Edge Cases', () => {
        it('should handle zero balance correctly', () => {
            ; (useAuthStore as jest.Mock).mockImplementation((selector) => {
                const state = {
                    isWalletLoading: false,
                    wallet: { balance: 0 },
                    decrementBalance: jest.fn()
                }
                return selector(state)
            })

            render(<BetActions {...defaultProps} />)

            const input = screen.getByDisplayValue('0.00')
            expect(input).toHaveAttribute('max', '0')

            const betButton = screen.getByRole('button', { name: 'Enter Bet' })
            expect(betButton).toBeDisabled()
        })

        it('should handle very large balance correctly', () => {
            ; (useAuthStore as jest.Mock).mockImplementation((selector) => {
                const state = {
                    isWalletLoading: false,
                    wallet: { balance: 999999999 },
                    decrementBalance: jest.fn()
                }
                return selector(state)
            })

            render(<BetActions {...defaultProps} />)

            const input = screen.getByDisplayValue('0.00')
            expect(input).toHaveAttribute('max', '999999999')
        })

        it('should handle decimal precision correctly', async () => {
            const user = userEvent.setup()
            render(<BetActions {...defaultProps} />)

            const input = screen.getByDisplayValue('0.00')
            await user.clear(input)
            await user.type(input, '99.999')

            expect(input).toHaveValue(99.999)
        })
    })

    describe('Accessibility', () => {
        it('should have proper ARIA labels', () => {
            render(<BetActions {...defaultProps} />)

            expect(screen.getByLabelText('Bet amount')).toBeInTheDocument()
            expect(screen.getByLabelText('Half bet')).toBeInTheDocument()
            expect(screen.getByLabelText('Double bet')).toBeInTheDocument()
            expect(screen.getByLabelText('Maximum bet')).toBeInTheDocument()
            expect(screen.getByLabelText('Number of lines')).toBeInTheDocument()
        })

        it('should have proper button titles', () => {
            render(<BetActions {...defaultProps} />)

            expect(screen.getByTitle('Half bet')).toBeInTheDocument()
            expect(screen.getByTitle('Double bet')).toBeInTheDocument()
            expect(screen.getByTitle('Maximum bet')).toBeInTheDocument()
        })
    })
}) 