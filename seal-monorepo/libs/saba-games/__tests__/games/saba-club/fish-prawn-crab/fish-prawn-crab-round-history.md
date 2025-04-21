# Fish Prawn Crab Round History Tests

This document outlines the test coverage for the refactored Fish Prawn Crab Round History components, which follow SOLID principles.

## Components Under Test

1. **SettlementService** - Processes game settlement results
2. **EmptyDiceRow** - Displays empty dice placeholders
3. **FishPrawnCrabRoundHistoryItem** - Displays individual round history with dice
4. **FishPrawnCrabRoundHistory** - Main component orchestrating round history display
5. **Constants** - Configuration values and mappings

## Test Strategy

All tests follow the AAA (Arrange, Act, Assert) pattern and aim for 100% code and branch coverage.

### Mock Dependencies

- All external dependencies are mocked to isolate component functionality:
  - `@sg/sg-game-client` - Game client services and translations
  - `FishPrawnCrabDice` - Dice UI component
  - Store subscriptions and callbacks

### Test Coverage

#### SettlementService Tests

- **Happy Path**: Processing valid settlement data with winning choices
- **Edge Cases**: Multiple winners, null input, undefined input, empty objects
- **Symbol Extraction**: Correct extraction of winning symbols

#### EmptyDiceRow Tests

- **Default Rendering**: With default count (3) and size (medium)
- **Custom Props**: With custom counts and sizes
- **Edge Cases**: Zero count
- **Key Validation**: Ensuring unique React keys for array elements

#### FishPrawnCrabRoundHistoryItem Tests

- **Happy Path**: Rendering with valid round data
- **Edge Cases**: Missing result, missing settlement, empty objects
- **Conditional Rendering**: Proper handling of null/undefined values

#### FishPrawnCrabRoundHistory Tests

- **State Management**: Correct subscription to and processing of round history data
- **Rendering**: Proper rendering of history items and empty dice
- **Boundary Conditions**: Limiting displayed rounds to MAX_DISPLAYED_ROUNDS
- **Edge Cases**: Empty rounds array, null rounds
- **Lifecycle**: Component subscription and cleanup

#### Constants Tests

- **Mapping Validation**: Ensuring all choice-to-symbol mappings are correct
- **Configuration Values**: Validating MAX_DISPLAYED_ROUNDS

## Coverage Goals

- **Line Coverage**: 100%
- **Branch Coverage**: 100%
- **Function Coverage**: 100%
- **Statement Coverage**: 100%

Each component is tested in isolation with proper mocking of dependencies, ensuring that the tests verify the component's behavior independently of other components. 