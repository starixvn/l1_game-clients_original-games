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
import * as gc from "@sg/sg-game-client";
import { GameBase } from "@shared/components/game-base";
import { ObserverComponent } from "@shared/components/observer-component";
import { BetOption } from "@shared/components/bet-option";
import { withRouter } from "next/router";
import { Tabs } from "react-bootstrap";
import Image from "next/image";
```

### 3.2 Game Settings Implementation

In `src/games/saba-club/vip-sedie/game-settings.ts`:

```typescript
export const gameSettings = {
    gameId: 22,
    namespace: "VipSeDie",
    mainObserverNamespace: "VipSeDie",
    // Add other specific settings
};
```

### 3.3 Main Components

1. **Page Component (page.tsx)**

    - Extend from base game implementation
    - Implement VIP-specific features
    - Use the VIP Se Die game settings
    - Implement proper component lifecycle management
    - Use `ObserverComponent` for efficient updates

2. **Header Component (header.tsx)**

    - Customize header for VIP version
    - Implement VIP-specific UI elements
    - Include game icon and title display
    - Add collapsible section support

3. **Bet Options (vip-sedie-bet-options.tsx)**
    - Implement custom betting options
    - Extend from base-sedie-bet-options if needed
    - Add VIP-specific betting features
    - Include bet validation logic

## 4. Game Navigation Bar (Lobby) Integration

### 4.1 Navigation Bar Structure

The game navigation bar (formerly referred to as lobby) is implemented using React-Bootstrap Tabs with the following structure:

```typescript
<Tabs defaultActiveKey={offerGames[0].gameId} className={styles["lobby-tabs"]}>
    {games.map((game) => (
        <Tab key={gameId} eventKey={gameId} title={<TabTitleWithIcon gameId={gameId} gameName={gameName} />} unmountOnExit={true}>
            {/* Game content */}
        </Tab>
    ))}
</Tabs>
```

### 4.2 Navigation Tab Components

Each game navigation tab includes:

1. **Tab Header**

    - Game icon (24x24 pixels)
    - Game name
    - Active/Inactive states
    - Custom styling for VIP version

2. **Game Content**
    - Collapsible game section
    - Expandable/collapsible toggle
    - Transition animations
    - Game-specific content area

### 4.3 Navigation Bar Styling

The game navigation bar uses modular SCSS with the following key style components:

```scss
.lobby-tabs {
    // Tab navigation styling
    :global(.nav-tabs) {
        border: none;
        padding: 4px 4px 0;
    }

    // Tab item styling
    :global(.nav-link) {
        background: url("/static/images/lobby/inactive-bg.png");
        border-radius: 4px 4px 0 0;

        &:global(.active) {
            background: url("/static/images/lobby/active-bg.png");
            color: #fff;
        }
    }

    // Tab title with icon
    .tab-title {
        display: flex;
        align-items: center;
        gap: 8px;

        .tab-icon {
            width: 24px;
            height: 24px;
            object-fit: contain;
        }
    }
}
```

### 4.4 Navigation State Management

The game navigation implements state management for:

1. **Game Expansion State**

```typescript
interface ILobbyState {
    isViewOnly: boolean;
    offerGames: { gameId: number }[];
    isRenderGame: boolean;
    expandedGames: { [gameId: number]: boolean };
}
```

2. **Game Navigation**

-   Handles game selection
-   Manages tab state
-   Controls game visibility
-   Handles collapsible sections

### 4.5 Game Icons and Assets

Game icons should be placed in:

```
public/static/images/game-icons/
├── sedie.png
└── vip-sedie.png
```

Icon specifications:

-   Size: 24x24 pixels
-   Format: PNG with transparency
-   Quality: Optimized for web

### 4.6 Responsive Behavior

The game navigation implementation includes:

1. **Adaptive Layout**

    - Flexible grid system
    - Mobile-friendly navigation
    - Responsive tab handling

2. **Performance Optimization**
    - Lazy loading of game components
    - Efficient state updates
    - Optimized asset loading

## 5. Integration Steps

### 5.1 Update App Settings

1. **App Settings Configuration**

```typescript
// src/_shared/app-settings/index.ts
import { settingsVipSeDie } from "../../games/saba-club/vip-sedie/game-settings";

export const gameSettings = {
    // ... existing settings ...
    [settingsVipSeDie.id]: settingsVipSeDie,
};
```

2. **Type Definitions**

```typescript
// src/_shared/app-settings/type.d.ts
export interface IGameSettings {
    // ... existing types ...
    22: typeof import("../../games/saba-club/vip-sedie/game-settings").settingsVipSeDie;
}
```

3. **Constants**

```typescript
// src/_shared/constants/index.ts
export const GAME_IDS = {
    // ... existing ids ...
    VIP_SE_DIE: 22,
} as const;
```

### 5.2 Implement Localization

1. **English Translations**

```json
// src/i18n/locales/en.json
{
    "games": {
        "vip_sedie": {
            "title": "VIP Se Die",
            "game_name": "VIP Se Die",
            "bet_options": {
                "big": "Big",
                "small": "Small",
                "specific": "Specific"
            },
            "messages": {
                "bet_success": "Bet placed successfully",
                "bet_failed": "Failed to place bet",
                "insufficient_balance": "Insufficient balance"
            }
        }
    }
}
```

2. **Indonesian Translations**

```json
// src/i18n/locales/id.json
{
    "games": {
        "vip_sedie": {
            "title": "VIP Se Die",
            "game_name": "VIP Se Die",
            "bet_options": {
                "big": "Besar",
                "small": "Kecil",
                "specific": "Spesifik"
            },
            "messages": {
                "bet_success": "Taruhan berhasil dipasang",
                "bet_failed": "Gagal memasang taruhan",
                "insufficient_balance": "Saldo tidak mencukupi"
            }
        }
    }
}
```

### 5.3 Component Integration

1. **Game Registration**

```typescript
// src/lobby/utils.tsx
import { VipSeDie } from "../games/saba-club";

const getGameById = (gameId: number, router: NextRouter) => {
    const games: { [x: number]: JSX.Element } = {
        // ... existing games ...
        [settingsVipSeDie.id]: <VipSeDie.Page router={router} namespace={settingsVipSeDie.mainObserverNamespace} />,
    };
    return games[gameId];
};
```

2. **Header Integration**

```typescript
const getGameHeaderById = (gameId: number, isExpanded: boolean, onToggleExpand: (gameId: number) => void) => {
    const gameHeader = {
        // ... existing headers ...
        [settingsVipSeDie.id]: <VipSeDie.Header />,
    };
    // ... rest of the implementation
};
```

3. **Icon Registration**

```typescript
const getGameIconPath = (gameId: number): string => {
    const iconMap: { [key: number]: string } = {
        // ... existing icons ...
        [settingsVipSeDie.id]: "/static/images/game-icons/vip-sedie.png",
    };
    return iconMap[gameId] || "";
};
```

### 5.4 Styling Integration

1. **Game-Specific Styles**

```scss
// src/games/saba-club/vip-sedie/vip-sedie.module.scss
@import "@shared/components/game-base/game-base.module.scss";

.vip-sedie {
    &-container {
        background: var(--vip-background);
        border-radius: 8px;
        padding: 16px;
    }

    &-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
    }

    &-bet-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-top: 16px;
    }
}
```

2. **Lobby Style Updates**

```scss
// src/lobby/lobby.module.scss
.lobby-tabs {
    // ... existing styles ...

    .vip-game {
        .nav-link {
            background: url("/static/images/lobby/vip-inactive-bg.png");

            &:global(.active) {
                background: url("/static/images/lobby/vip-active-bg.png");
            }
        }
    }
}
```

### 5.5 WebSocket Integration

1. **Namespace Configuration**

```typescript
// src/games/saba-club/vip-sedie/game-settings.ts
export const settingsVipSeDie = {
    // ... other settings ...
    websocket: {
        proxyPath: "",
        route: "livepagegateway",
    },
    mainObserverNamespace: "VipSeDie",
    isSocketGateway: true,
};
```

2. **Connection Handler**

```typescript
@handle(gc.GatewayConnection.GatewayConnectionHandlers.ConnectHandler)
protected handleConnect() {
    // VIP Se Die specific connection logic
}
```

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

4. **Game Not Appearing in Lobby**
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

3. **Configuration**:
    - Keep game settings modular
    - Use environment variables where appropriate
    - Maintain clear documentation

## 12. Component Inheritance Structure

### 12.1 Bet Options Component

The VIP Se Die bet options component inherits from the base Se Die implementation:

```typescript
// src/games/saba-club/vip-sedie/bet-option/vip-sedie-bet-options.tsx
import SeDieBetOptions from "../../sedie/bet-option/sedie-bet-options";

export default class VIPSeDieBetOptions extends SeDieBetOptions {
    public renderSubOptions(betChoice: string, odd: number, fractional: boolean, name: string = "", isBoostedChoice: boolean = false) {
        return super.renderSubOptions(betChoice, odd, fractional, name, isBoostedChoice);
    }

    public renderMainOption(name: string, odd: number, betChoice: string, fractional: boolean, isBoostedChoice: boolean = false) {
        return super.renderMainOption(name, odd, betChoice, fractional, isBoostedChoice);
    }
}
```

### 12.2 Main Game Component

The main game component extends GatewayGameBase and uses the observer pattern:

```typescript
@observer(setting.mainObserverNamespace)
export default class VipSeDie extends GatewayGameBase<GameBaseProps, IGameBaseState> {
    constructor(props: GameBaseProps) {
        super(props);
        configGameContainer(setting.name, containerOptions);
    }

    // Component implementations
}
```

## 13. Styling Updates

### 13.1 VIP-Specific Styling

The VIP version includes premium styling with a gradient background and enhanced visual effects:

```scss
.bet-options-wrapper {
    background: linear-gradient(to bottom, #2c3e50, #3498db);
    padding: 1rem;
    border-radius: 8px;
}

.container-bets {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
}

.bets-bg {
    background-color: rgba(255, 246, 243, 0.15);
    backdrop-filter: blur(5px);
}

.main-option {
    color: #fff;
    font-weight: 600;
}
```

### 13.2 Header Component

The header component has been updated with VIP-specific styling and layout:

```typescript
const Header: React.FC<HeaderProps> = ({ arrowProps }) => {
    return (
        <div className={styles["game-title"]}>
            <div className={styles["title-with-icon"]}>
                <Image src="/static/images/lobby/arrow.png" alt="Arrow Icon" width={24} height={24} {...arrowProps} priority />
                <span className={styles.divider} />
                <Image
                    src="/static/images/game-icons/vip-sedie.png"
                    alt="VIP Sedie Game Icon"
                    width={32}
                    height={32}
                    className={styles["game-icon"]}
                    priority
                />
                <div>{gameName}</div>
            </div>
            <div className={styles["game-title-text-center"]}>Odd/Even</div>
            <div className={styles["game-title-text-center"]}>Red/White</div>
        </div>
    );
};
```

## 14. Implementation Changes

### 14.1 Game Settings

The game settings have been updated to use a more modular approach:

```typescript
import { getGameSetting, getSiteConfig } from "../../../_shared/app-settings";
import { GameIds } from "../../../_shared/constants";

export const setting = getGameSetting(GameIds.VipSeDie);
export const siteConfigs = getSiteConfig(GameIds.VipSeDie);
export const containerOptions: gc.IContainerOptions = gc.getGameContainer(setting, siteConfigs, sharedContainer);
```

### 14.2 Component Reuse

The VIP version reuses several components from the base Se Die implementation:

```typescript
import SeDieRoundHistory from "../sedie/round-history";
import SeDieSettlementResult from "../sedie/settlement-result";
import { SedieStatistic } from "../sedie/statistic";
```

### 14.3 Result Display

The result display implementation has been enhanced:

```typescript
async showResult(
    hasAnimation: boolean,
    result?: gc.GameServiceMessage.TResult,
    settlementResult?: gc.GameServiceMessage.TSettlementResult
) {
    await FunctionUtils.delay(2000);
}
```

## 15. Testing Considerations

### 15.1 Component Testing

When testing VIP Se Die components, consider:

1. **Inheritance Testing**

    - Test that overridden methods maintain base functionality
    - Verify VIP-specific enhancements work correctly
    - Test interaction between parent and child components

2. **Styling Tests**

    - Verify VIP-specific styles are applied correctly
    - Test responsive behavior
    - Ensure proper inheritance of base styles

3. **Integration Tests**
    - Test interaction with shared components
    - Verify proper game state management
    - Test betting flow with VIP limits

### 15.2 Performance Testing

Additional performance considerations for VIP implementation:

1. **Resource Loading**

    - Monitor loading time of VIP assets
    - Test performance with premium animations
    - Verify memory usage with enhanced graphics

2. **State Management**
    - Test observer pattern implementation
    - Verify proper cleanup of resources
    - Monitor WebSocket connection stability

## 16. Deployment Notes

### 16.1 Asset Management

1. **VIP Assets**

    - Ensure all VIP-specific assets are properly optimized
    - Verify asset paths in production build
    - Implement proper caching strategies

2. **Build Process**
    - Update build configuration for VIP assets
    - Verify proper bundling of VIP components
    - Test production build performance

### 16.2 Configuration Management

1. **Environment Settings**

    - Verify VIP-specific settings in all environments
    - Test configuration inheritance
    - Validate WebSocket endpoints

2. **Feature Flags**
    - Implement VIP feature toggles
    - Test graceful degradation
    - Verify access control

## 17. Monitoring and Analytics

### 17.1 VIP-Specific Metrics

Monitor these additional metrics for VIP implementation:

1. **Performance Metrics**

    - Component render times
    - Asset loading performance
    - WebSocket connection stability

2. **User Engagement**

    - VIP feature usage
    - Betting patterns
    - Session duration

3. **Error Tracking**
    - VIP-specific error rates
    - Component error boundaries
    - WebSocket connection issues

### 17.2 Logging

Implement additional logging for VIP features:

1. **User Actions**

    - VIP betting patterns
    - Feature usage
    - Error scenarios

2. **System Events**
    - Component lifecycle events
    - State transitions
    - WebSocket events

This guide provides a comprehensive overview of integrating VIP Se Die into your project. Follow each section carefully and ensure proper testing at each stage of integration.
