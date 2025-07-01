<!-- @format -->

# Plinko Game - Demo Balance Feature

## Overview

The Plinko game has been configured with a hard-coded balance system for demo purposes. This allows users to play the game without authentication and test all betting features.

## Features

### Hard-Coded Balance

- **Starting Balance**: $10,000
- **Location**: `src/store/plinko/store/auth.ts`
- **Constant**: `HARD_CODED_BALANCE = 10000`

### Balance Management

- **Auto-Reset**: When balance reaches $0, it automatically resets to $10,000
- **No Persistence**: Balance is not saved to localStorage (demo only)
- **Real-time Updates**: Balance updates immediately after bets

### Visual Indicators

- **Demo Balance Badge**: Green badge showing current balance with 💰 emoji
- **Pulse Animation**: Subtle animation to draw attention to the demo status
- **Responsive Design**: Works on both mobile and desktop

## How to Use

1. **Navigate to**: `http://localhost:3000/plinko`
2. **Enter Bet Amount**: Use the input field or quick buttons (½, 2x, max)
3. **Select Lines**: Choose between 8-16 lines
4. **Place Bet**: Click the "Bet" button to start the game
5. **Watch Results**: See your balance update based on game results

## Betting Options

### Quick Bet Buttons

- **½**: Half the current bet amount
- **2x**: Double the current bet amount
- **max**: Set bet to current balance

### Line Selection

- **Range**: 8 to 16 lines
- **Default**: 16 lines
- **Disabled**: When balls are in play

## Technical Details

### Store Configuration

```typescript
// Hard-coded balance for demo purposes
const HARD_CODED_BALANCE = 10000; // $10,000 starting balance

// Auto-reset when balance reaches zero
if (newBalance === 0) {
  getState().setBalance(HARD_CODED_BALANCE);
}
```

### Component Updates

- **BetActions**: Enhanced with demo balance indicator
- **Button States**: Dynamic text based on game state
- **Accessibility**: ARIA labels and proper disabled states

## Styling

- **Demo Badge**: Green gradient with pulse animation
- **Responsive**: Adapts to different screen sizes
- **Theme**: Consistent with plinko game design

## Development Notes

- This is for demo/testing purposes only
- In production, replace with real authentication and balance management
- The hard-coded balance can be easily modified by changing the `HARD_CODED_BALANCE` constant
