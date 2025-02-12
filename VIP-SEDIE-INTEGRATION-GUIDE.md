# VIP Se Die Integration Guide

## Overview

This guide provides comprehensive instructions for integrating VIP Se Die (GameId: 22) into projects with existing Se Die (GameId: 2) implementation. VIP Se Die is an enhanced variant of the Se Die game with specific configurations, styling, and premium features.

## Prerequisites

-   Existing Se Die implementation
-   Access to project codebase
-   Required assets and configurations

## 1. Configuration Setup

### 1.1 Game Settings Configuration

Add the following configuration to `game-settings.json`:

```json
"22": {
    "id": 22,
    "gameName": "VipSeDie",
    "name": "VipSeDie",
    "namespaces": ["VipSeDie"],
    "isVisible": true,
    "durations": {
        "wholeRound": 39,
        "lockingBet": 5,
        "placingBet": 30,
        "generatingResult": 1,
        "showingResult": 6,
        "startRound": 2
    },
    "numberOfRoundHistory": 100,
    "websocket": {
        "proxyPath": "",
        "route": "livepagegateway"
    },
    "mainObserverNamespace": "VipSeDie",
    "order": 2,
    "isSocketGateway": true
}
```

### 1.2 Update configs.json

Add VIP Se Die configuration:

```json
{
    "games": {
        "22": {
            "id": 22,
            "name": "VIP Se Die",
            "icon": "/static/images/game-icons/vip-sedie.png"
        }
    }
}
```

## 2. File Structure Setup

### 2.1 Create Directory Structure

Create the following directory structure under `src/games/saba-club/`:

```
vip-sedie/
├── bet-option/
│   └── vip-sedie-bet-options.tsx
├── game-settings.ts
├── header.tsx
├── index.ts
├── page.tsx
└── vip-sedie.module.scss
```

### 2.2 Asset Integration

Add the following assets to the project:

```
public/static/images/
├── game-icons/
│   ├── sedie.png
│   └── vip-sedie.png
└── lobby/
    ├── active-bg.png
    ├── arrow.png
    └── inactive-bg.png
```

## 3. Component Implementation

### 3.1 Required Imports

Add these imports to your components:

```typescript
import { GameBase } from "@shared/components/game-base";
import { ObserverComponent } from "@shared/components/observer-component";
import { BetOption } from "@shared/components/bet-option";
```

### 3.2 Game Settings Implementation

In `src/games/saba-club/vip-sedie/game-settings.ts`:

```typescript
export const gameSettings = {
    gameId: 22,
    namespace: "VipSeDie",
    // Add other specific settings
};
```

### 3.3 Main Components

1. **Page Component (page.tsx)**

    - Extend from base game implementation
    - Implement VIP-specific features
    - Use the VIP Se Die game settings

2. **Header Component (header.tsx)**

    - Customize header for VIP version
    - Implement VIP-specific UI elements

3. **Bet Options (vip-sedie-bet-options.tsx)**
    - Implement custom betting options
    - Extend from base-sedie-bet-options if needed
    - Add VIP-specific betting features

## 4. Integration Steps

### 4.1 Update App Settings

1. Modify `src/_shared/app-settings/index.ts` to include VIP Se Die
2. Update types in `src/_shared/app-settings/type.d.ts`
3. Add VIP Se Die related constants to `src/_shared/constants/index.ts`

### 4.2 Implement Localization

Add translations in:

1. English (src/i18n/locales/en.json):

```json
{
    "games": {
        "vip_sedie": {
            "title": "VIP Se Die"
            // Add other translations
        }
    }
}
```

2. Indonesian (src/i18n/locales/id.json):

```json
{
    "games": {
        "vip_sedie": {
            "title": "VIP Se Die"
            // Add other translations
        }
    }
}
```

### 4.3 Update Game Navigation Bar (Lobby) Integration

-   Modify `src/lobby/lobby.module.scss` for VIP Se Die styling in the game navigation bar
-   Add game to navigation bar list

Note: The term "lobby" in this codebase refers to the game navigation bar component that allows users to switch between different games.

### 4.4 Update Lobby Integration

-   Modify `src/lobby/lobby.module.scss` for VIP Se Die styling
-   Add game to lobby list

## 5. Styling Implementation

### 5.1 Game-Specific Styles

Create `vip-sedie.module.scss`:

```scss
// Import base styles
@import "@shared/components/game-base/game-base.module.scss";

// Add VIP Se Die specific styles
```

### 5.2 Update Shared Styles

Modify `src/_shared/components/game-base/game-base.module.scss` if needed

## 6. Testing Requirements

### 6.1 Component Testing

-   Test game initialization
-   Test betting functionality
-   Test WebSocket connections
-   Test game state management

### 6.2 Integration Testing

-   Test interaction with lobby
-   Test game transitions
-   Test bet placement and results
-   Test VIP-specific features
-   Test UI/UX elements

## 7. Key Differences from Regular Se Die

1. **Game ID**:

    - Regular Se Die: 2
    - VIP Se Die: 22

2. **UI Components**:

    - Custom VIP styling
    - Enhanced betting options
    - VIP-specific header

3. **Features**:
    - VIP-specific betting limits
    - Enhanced game rules
    - Premium user experience

## 8. Important Notes

### 8.1 WebSocket Configuration

-   Ensure WebSocket connection uses the correct namespace ("VipSeDie")
-   Configure proper routes in gateway

### 8.2 Performance Considerations

-   Implement proper component lifecycle management
-   Use `ObserverComponent` for efficient updates

### 8.3 Security Considerations

-   Implement proper bet validation
-   Ensure secure WebSocket communication

### 8.4 Game Not Appearing in Navigation Bar

    - Check game registration in configs.json
    - Verify game ID configuration

## 9. Troubleshooting

Common issues and solutions:

1. **WebSocket Connection Issues**

    - Verify namespace configuration
    - Check gateway routes

2. **Styling Issues**

    - Ensure proper SCSS module imports
    - Check class name conflicts

3. **State Management Issues**

    - Verify observer pattern implementation
    - Check state updates in components

4. **Game Not Appearing in Navigation Bar**
    - Check game registration in configs.json
    - Verify game ID configuration

## 10. Deployment Checklist

-   [ ] Configure game settings
-   [ ] Add all required assets
-   [ ] Implement all components
-   [ ] Add translations
-   [ ] Test WebSocket connections
-   [ ] Verify styling
-   [ ] Test bet placement
-   [ ] Test game results
-   [ ] Verify lobby integration
-   [ ] Performance testing
-   [ ] Security testing

## 11. Support and Maintenance

1. **Regular Testing**:

    - Game functionality
    - Integration points
    - Performance metrics

2. **Documentation Updates**:
    - New features
    - Configuration changes
    - Bug fixes

## Best Practices

1. **Code Organization**:

    - Keep VIP-specific code in dedicated folders
    - Reuse base components when possible
    - Maintain clear separation of concerns

2. **Asset Management**:

    - Use proper naming conventions
    - Optimize images for web
    - Maintain consistent directory structure
    - Ensure navigation bar (lobby) icons follow the established pattern

3. **Configuration**:
    - Keep game settings modular
    - Use environment variables where appropriate
    - Maintain clear documentation

This guide provides a comprehensive overview of integrating VIP Se Die into your project. Follow each section carefully and ensure proper testing at each stage of integration.
