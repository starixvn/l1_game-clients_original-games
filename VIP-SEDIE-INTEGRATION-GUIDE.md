# VIP Se Die Integration Guide

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Core Implementation](#core-implementation)
    - [Configuration Setup](#configuration-setup)
    - [File Structure](#file-structure)
    - [Component Implementation](#component-implementation)
    - [Game Navigation Integration](#game-navigation-integration)
4. [Technical Details](#technical-details)
    - [Integration Steps](#integration-steps)
    - [WebSocket Integration](#websocket-integration)
    - [Component Inheritance](#component-inheritance)
    - [Styling Implementation](#styling-implementation)
5. [Testing & Quality Assurance](#testing--quality-assurance)
6. [Deployment & Maintenance](#deployment--maintenance)
7. [Reference](#reference)

## Overview

This guide provides comprehensive instructions for integrating VIP Se Die (GameId: 22) into projects with existing Se Die (GameId: 2) implementation. VIP Se Die is an enhanced variant of the Se Die game with specific configurations, styling, and premium features.

## Prerequisites

-   Existing Se Die implementation
-   Access to project codebase
-   Required assets and configurations

## Core Implementation

### Configuration Setup

Required configuration changes:

1. **game-settings.json**:

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

2. **configs.json**:

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

### File Structure

1. **Directory Structure** (`src/games/saba-club/`):

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

2. **Required Assets** (`public/static/images/`):

```
├── game-icons/
│   ├── sedie.png
│   └── vip-sedie.png
└── lobby/
    ├── active-bg.png
    ├── arrow.png
    └── inactive-bg.png
```

### Component Implementation

1. **Required Imports**:

```typescript
import * as gc from "@sg/sg-game-client";
import { GameBase } from "@shared/components/game-base";
import { ObserverComponent } from "@shared/components/observer-component";
import { BetOption } from "@shared/components/bet-option";
import { withRouter } from "next/router";
import { Tabs } from "react-bootstrap";
import Image from "next/image";
```

2. **Game Settings** (`game-settings.ts`):

```typescript
export const gameSettings = {
    gameId: 22,
    namespace: "VipSeDie",
    mainObserverNamespace: "VipSeDie",
    // Add other specific settings
};
```

3. **Core Components**:
    - **Page Component** (`page.tsx`): Extends base game implementation with VIP features
    - **Header Component** (`header.tsx`): VIP-specific UI elements and styling
    - **Bet Options** (`vip-sedie-bet-options.tsx`): Custom betting implementation

### Game Navigation Integration

1. **Navigation Structure**:

```typescript
<Tabs defaultActiveKey={offerGames[0].gameId} className={styles["lobby-tabs"]}>
    {games.map((game) => (
        <Tab key={gameId} eventKey={gameId} title={<TabTitleWithIcon gameId={gameId} gameName={gameName} />} unmountOnExit={true}>
            {/* Game content */}
        </Tab>
    ))}
</Tabs>
```

## Technical Details

### Integration Steps

1. **App Settings Updates**:

```typescript
// src/_shared/app-settings/index.ts
import { settingsVipSeDie } from "../../games/saba-club/vip-sedie/game-settings";
export const gameSettings = {
    [settingsVipSeDie.id]: settingsVipSeDie,
};

// src/_shared/app-settings/type.d.ts
export interface IGameSettings {
    22: typeof import("../../games/saba-club/vip-sedie/game-settings").settingsVipSeDie;
}

// src/_shared/constants/index.ts
export const GAME_IDS = {
    VIP_SE_DIE: 22,
} as const;
```

2. **Localization Files**:

```json
// src/i18n/locales/en.json & id.json
{
    "games": {
        "vip_sedie": {
            "title": "VIP Se Die",
            "game_name": "VIP Se Die",
            "bet_options": {
                "big": "Big/Besar",
                "small": "Small/Kecil",
                "specific": "Specific/Spesifik"
            },
            "messages": {
                "bet_success": "Bet placed successfully/Taruhan berhasil dipasang",
                "bet_failed": "Failed to place bet/Gagal memasang taruhan",
                "insufficient_balance": "Insufficient balance/Saldo tidak mencukupi"
            }
        }
    }
}
```

3. **Component Registration**:

```typescript
// src/lobby/utils.tsx
const getGameById = (gameId: number, router: NextRouter) => ({
    [settingsVipSeDie.id]: <VipSeDie.Page router={router} namespace={settingsVipSeDie.mainObserverNamespace} />,
});

const getGameHeaderById = (gameId: number) => ({
    [settingsVipSeDie.id]: <VipSeDie.Header />,
});

const getGameIconPath = (gameId: number) => ({
    [settingsVipSeDie.id]: "/static/images/game-icons/vip-sedie.png",
});
```

### WebSocket Integration

```typescript
@handle(gc.GatewayConnection.GatewayConnectionHandlers.ConnectHandler)
protected handleConnect() {
    // VIP Se Die specific connection logic
}
```

### Component Inheritance

1. **Bet Options Component**:

```typescript
export default class VIPSeDieBetOptions extends SeDieBetOptions {
    public renderSubOptions(betChoice: string, odd: number, fractional: boolean, name: string = "", isBoostedChoice: boolean = false) {
        return super.renderSubOptions(betChoice, odd, fractional, name, isBoostedChoice);
    }

    public renderMainOption(name: string, odd: number, betChoice: string, fractional: boolean, isBoostedChoice: boolean = false) {
        return super.renderMainOption(name, odd, betChoice, fractional, isBoostedChoice);
    }
}
```

2. **Main Game Component**:

```typescript
@observer(setting.mainObserverNamespace)
export default class VipSeDie extends GatewayGameBase<GameBaseProps, IGameBaseState> {
    constructor(props: GameBaseProps) {
        super(props);
        configGameContainer(setting.name, containerOptions);
    }
}
```

### Styling Implementation

1. **VIP-Specific Styles**:

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
```

2. **Header Component**:

```typescript
const Header: React.FC<HeaderProps> = ({ arrowProps }) => (
    <div className={styles["game-title"]}>
        <div className={styles["title-with-icon"]}>
            <Image src="/static/images/lobby/arrow.png" alt="Arrow Icon" width={24} height={24} {...arrowProps} priority />
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
```

## Testing & Quality Assurance

-   Component Testing: Game initialization, betting, WebSocket, state management
-   Integration Testing: Lobby interaction, transitions, VIP features
-   Performance Testing: Resource loading, state management, WebSocket stability

## Deployment & Maintenance

### Checklist & Monitoring

-   [ ] Configuration setup
-   [ ] Asset integration
-   [ ] Component implementation
-   [ ] Translations
-   [ ] Testing (WebSocket, styling, betting, results)
-   [ ] Performance & security testing

### Metrics & Logging

-   Performance: Component rendering, asset loading, WebSocket stability
-   User Engagement: VIP features, betting patterns, session duration
-   Error Tracking: VIP-specific errors, component boundaries
-   System Events: Component lifecycle, state transitions, WebSocket events

## Reference

### Key Differences from Regular Se Die

-   Game ID: Regular (2) vs VIP (22)
-   Enhanced UI Components & Premium Features
-   VIP-specific betting limits and rules

### Best Practices

-   Code Organization: Dedicated folders, component reuse, separation of concerns
-   Asset Management: Naming conventions, optimization, directory structure
-   Configuration: Modular settings, environment variables, documentation

### Troubleshooting

-   WebSocket: Check namespace configuration and routes
-   Styling: Verify SCSS imports and class conflicts
-   State Management: Observer pattern implementation
-   Game Registration: Verify configs.json and game ID configuration

This guide provides a comprehensive overview of integrating VIP Se Die into your project. Follow each section carefully and ensure proper testing at each stage of integration.
