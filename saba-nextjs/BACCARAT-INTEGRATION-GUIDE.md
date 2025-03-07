# Baccarat Integration Guide

Version 1.0  
Last updated: 12 Feb 2025

## Table of Contents

[**1. Overview**](#1-overview)  
[**2. Prerequisites**](#2-prerequisites)  
[**3. Core Implementation**](#3-core-implementation)  
[3.1. Configuration Setup](#31-configuration-setup)  
[3.2. File Structure](#32-file-structure)  
[3.3. Component Implementation](#33-component-implementation)  
[3.4. Game Navigation Integration](#34-game-navigation-integration)  
[**4. Technical Details**](#4-technical-details)  
[4.1. Integration Steps](#41-integration-steps)  
[4.2. WebSocket Integration](#42-websocket-integration)  
[4.3. Component Inheritance](#43-component-inheritance)  
[**5. Asset Management**](#5-asset-management)  
[**6. Animation Implementation**](#6-animation-implementation)  
[6.1. Demo Component Structure](#61-demo-component-structure)  
[6.2. Key Components](#62-key-components)  
[6.3. Animation Scenarios](#63-animation-scenarios)  
[6.4. Animation States](#64-animation-states)  
[6.5. Styling Guidelines](#65-styling-guidelines)  
[**7. Checklist**](#7-checklist)  
[**8. Reference**](#8-reference)

## Revision History

| Date        | Version | Description of Change              | Authors |
| ----------- | ------- | ---------------------------------- | ------- |
| 12 Feb 2025 | 1.0     | Initial Baccarat Integration Guide | David   |

# **1. Overview**

This guide provides comprehensive instructions for integrating Baccarat (GameId: 10) into your project. Baccarat is a card game implementation with advanced features including real-time card animations, scoreboards, and statistics tracking.

# **2. Prerequisites**

-   Next.js/React project setup
-   Access to project codebase
-   Required assets and configurations
-   WebSocket implementation for real-time updates

# **3. Core Implementation**

## **3.1. Configuration Setup**

Required configuration changes:

1. **game-settings.json**:

```json
"10": {
    "id": 10,
    "gameName": "Baccarat",
    "name": "Baccarat",
    "namespaces": ["Baccarat"],
    "isVisible": true,
    "durations": {
        "wholeRound": 45,
        "lockingBet": 5,
        "placingBet": 30,
        "generatingResult": 2,
        "showingResult": 8,
        "startRound": 2
    },
    "numberOfRoundHistory": 100,
    "websocket": {
        "proxyPath": "",
        "route": "livepagegateway"
    },
    "mainObserverNamespace": "Baccarat",
    "order": 3,
    "isSocketGateway": true
}
```

2. **configs.json**:

```json
{
    "games": {
        "10": {
            "id": 10,
            "name": "Baccarat",
            "icon": "/static/images/game-icons/game-icon-10.png"
        }
    }
}
```

## **3.2. File Structure**

1. **Directory Structure** (`src/games/saba-club/`):

```
baccarat/
├── baccarat-anim/
│   └── constants.ts
├── bet-option/
│   ├── baccarat-bet-options.tsx
│   └── baccarat-bet-options.module.scss
├── scoreboard/
│   ├── baccarat-scoreboards.tsx
│   └── big-road-helper.ts
├── settlement-result/
│   ├── components/
│   └── styles/
├── game-settings.ts
├── header.tsx
├── page.tsx
└── index.ts
```

2. **Required Assets**:

```
public/static/images/
├── cards/
│   ├── [1-10,J,Q,K,A]-[club,diamond,heart,spade].svg
│   ├── card-back.jpg
│   └── mini/
├── baccarat/
│   └── scoreboard/
│       ├── big-road/
│       └── indicator/
└── game-icons/
    └── game-icon-10.png
```

## **3.3. Component Implementation**

1. **Core Components**:

```typescript
// page.tsx
import * as gc from "@sg/sg-game-client";
import { GameBase } from "@shared/components/game-base";
import { ObserverComponent } from "@shared/components/observer-component";

@observer(setting.mainObserverNamespace)
export default class Baccarat extends GameBase<GameBaseProps, IGameBaseState> {
    constructor(props: GameBaseProps) {
        super(props);
        configGameContainer(setting.name, containerOptions);
    }
}
```

2. **Bet Options Component**:

```typescript
// bet-option/baccarat-bet-options.tsx
export default class BaccaratBetOptions extends BetOptionsBase {
    public renderBetOptions() {
        return (
            <>
                {this.renderPlayerOption()}
                {this.renderBankerOption()}
                {this.renderTieOption()}
                {this.renderPairOptions()}
            </>
        );
    }
}
```

## **3.4. Game Navigation Integration**

```typescript
// lobby/utils.tsx
const getGameById = (gameId: number, router: NextRouter) => ({
    [settingsBaccarat.id]: <Baccarat.Page router={router} namespace={settingsBaccarat.mainObserverNamespace} />,
});
```

# **4. Technical Details**

## **4.1. Integration Steps**

1. **App Settings Updates**:

```typescript
// src/_shared/app-settings/index.ts
import { settingsBaccarat } from "../../games/saba-club/baccarat/game-settings";
export const gameSettings = {
    [settingsBaccarat.id]: settingsBaccarat,
};
```

2. **Localization Files**:

```json
// src/i18n/locales/en.json
{
    "games": {
        "baccarat": {
            "title": "Baccarat",
            "bet_options": {
                "player": "Player",
                "banker": "Banker",
                "tie": "Tie",
                "player_pair": "Player Pair",
                "banker_pair": "Banker Pair"
            }
        }
    }
}
```

## **4.2. WebSocket Integration**

```typescript
@handle(gc.GatewayConnection.GatewayConnectionHandlers.ConnectHandler)
protected handleConnect() {
    // Baccarat specific connection logic
}
```

## **4.3. Component Inheritance**

```typescript
@observer(setting.mainObserverNamespace)
export default class Baccarat extends GatewayGameBase<GameBaseProps, IGameBaseState> {
    constructor(props: GameBaseProps) {
        super(props);
        configGameContainer(setting.name, containerOptions);
    }
}
```

# **5. Asset Management**

1. **Card Assets**:

    - Standard playing cards (A-K) in four suits
    - Card back design
    - Mini card variants for scoreboard

2. **Scoreboard Assets**:
    - Big Road indicators
    - Result beads
    - Pattern indicators

# **6. Animation Implementation**

## **6.1. Demo Component Structure**

```typescript
src/pages/demo/baccarat-anim/
├── index.tsx              // Main demo component
├── styles.module.scss     // Animation styles
├── constants/            // Animation scenarios and text
└── hooks/               // Custom animation hooks
```

## **6.2. Key Components**

1. **BaccaratAnimationDemo**:

```typescript
const BaccaratAnimationDemo: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimationResult, setIsAnimationResult] = useState(true);
    const [isShowResult, setIsShowResult] = useState(true);
    // ... animation logic
};
```

2. **CardDisplay**:

```typescript
<CardDisplay result={BACCARAT_SCENARIOS[currentIndex]} isAnimationResult={isAnimationResult} isShowResult={isShowResult} texts={TEXTS} />
```

## **6.3. Animation Scenarios**

1. **Natural Hands**:

    - Player/Banker natural 8 or 9
    - No third card drawn

2. **Three Card Hands**:

    - Complex drawing rules
    - Third card animations

3. **Pairs**:
    - Player/Banker pairs
    - Special pair animations

## **6.4. Animation States**

```typescript
interface AnimationState {
    isTransitioning: boolean; // Card transition state
    isAnimationResult: boolean; // Show animation
    isShowResult: boolean; // Show final result
}
```

## **6.5. Styling Guidelines**

```scss
.demoContent {
    flex: 1;
    height: 800px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #2a2a2a;
    border-radius: 8px;
    padding: 2rem;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
}

// Animation keyframes
@keyframes pulse {
    0% {
        transform: translateY(-50%) scale(0.95);
    }
    50% {
        transform: translateY(-50%) scale(1.1);
    }
    100% {
        transform: translateY(-50%) scale(0.95);
    }
}
```

# **7. Checklist**

-   [ ] Configuration setup
-   [ ] Asset integration
-   [ ] Component implementation
-   [ ] WebSocket integration
-   [ ] Scoreboard implementation
-   [ ] Animation setup
-   [ ] Translations
-   [ ] Testing

# **8. Reference**

## Key Features

1. **Real-time Card Animations**

    - Card dealing animations
    - Result reveal animations
    - Score calculations

2. **Scoreboard System**

    - Big Road pattern tracking
    - Historical results
    - Statistics display

3. **Betting System**
    - Multiple bet options
    - Real-time odds updates
    - Bet confirmation handling

## Troubleshooting

1. **WebSocket Issues**

    - Check namespace configuration
    - Verify connection settings
    - Monitor heartbeat

2. **Animation Problems**

    - Check asset loading
    - Verify timing configurations
    - Debug CSS transitions

3. **Scoreboard Errors**
    - Validate result data
    - Check pattern calculations
    - Verify historical data handling
