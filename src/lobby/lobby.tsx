import * as gc from '@sg/sg-game-client';
import { handle, observer, render } from '@sg/sg-observer';
import React from 'react';
import { configSharedContainer, sharedContainer } from '../games/game-base/startup';
import { LobbyStore } from '../_shared/states/lobby';
import * as lobbyUtils from './utils';
import styles from './lobby.module.scss';
import { AppContextConsumer } from '../appProvider';
import Loading from '../_shared/components/loading';
import { IOfferGame, ILobbyState } from './type';
import { gamePageMap } from '../_shared/utils/component-util';
import { GameDisconnectView } from '../games/game-base/components/game-disconnect-view';
import blurBgGame from '../assets/rng-soccer/blur-bg-game.png';

@observer
class LobbyComponent extends React.PureComponent<any, ILobbyState> {
    private reRenderGameTimeout?: NodeJS.Timeout;

    constructor(props: { token: string; onSSORetry?: () => Promise<void>; isReconnecting?: boolean }) {
        super(props);
        configSharedContainer();
        this.state = {
            offerGames: [],
            isRenderGame: true,
            leagueToogle: true,
            expandedGames: {},
            selectedGameId: null,
            isSessionTimeout: false,
            isAuthenticated: false,
            username: '',
        };
    }
    clearReRenderGameTimeout = () => {
        if (!this.reRenderGameTimeout) {
            return;
        }
        clearTimeout(this.reRenderGameTimeout);
    };

    componentWillUnmount() {
        this.clearReRenderGameTimeout();
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<ILobbyState>, snapshot?: any): void {
        if (prevProps.token !== this.props.token) {
            this.sso({ token: this.props.token });
        }
    }

    componentDidMount() {
        const { token } = this.props;
        this.sso({ token });
    }

    @handle(gc.Auth.AuthHandlers.SSO)
    sso(ssoInfo: gc.Auth.ISSOInfo) {
        return ssoInfo;
    }

    @render(gc.App.AppStore, (store) => store.isSessionTimeout)
    redirectToSessionTimeoutPage(isSessionTimeout: boolean) {
        this.setState({ isSessionTimeout });
    }

    @render(gc.Auth.AuthStore, (store) => store.isAuthenticated)
    handleIsAuthenticated(isAuthenticated: boolean) {
        this.setState({ isAuthenticated });
        if (isAuthenticated) {
            this.connectLiveGateway();
        }
    }

    @handle(gc.GatewayConnection.GatewayConnectionHandlers.ConnectHandler)
    connectLiveGateway() { }

    @render(gc.Player.MainPlayerStore, (store) => store.offerGames)
    handleOfferGames(offerGames: IOfferGame[]) {
        if (offerGames?.length > 0) {
            const filteredOfferGames = lobbyUtils.getFilteredGames(offerGames);
            const expandedGames = filteredOfferGames.reduce(
                (acc, game) => {
                    acc[game.gameId] = true;
                    return acc;
                },
                {} as { [key: number]: boolean },
            );
            this.setState({ offerGames: filteredOfferGames, expandedGames } as ILobbyState);

            if (!this.state.selectedGameId) {
                this.setState({ selectedGameId: filteredOfferGames[0].gameId });
            }
        }
    }

    @render(LobbyStore, (store) => store.tryToConnectCount)
    updateTryToConnectCount(tryToConnectCount: number) {
        const isDisconnect = tryToConnectCount > 0;
        if (isDisconnect) {
            this.setState({ isRenderGame: false });
            this.reRenderGameTimeout = setTimeout(() => {
                this.setState({ isRenderGame: true });
            }, 500);
        }
    }

    @render(gc.Auth.AuthStore, (store) => store.username)
    private handleUsername(username: string) {
        username && this.setState({ username });
    }

    updateLeagueToogle = (leagueToogle: boolean) => {
        this.setState({ leagueToogle });
    };

    handleTabClick = (gameId: number) => {
        this.setState({ selectedGameId: gameId });
    };

    handleSessionReconnect = async () => {
        console.log('🔄 [LOBBY] Session reconnect requested');

        // Call parent's onSSORetry callback if provided
        if (this.props.onSSORetry) {
            console.log('🔄 [LOBBY] Calling parent onSSORetry callback');
            try {
                await this.props.onSSORetry();
                console.log('🔄 [LOBBY] Session reconnect completed successfully');

                // Reset connection simulator state after successful SSO retry
                this.resetConnectionSimulatorState();

                // Dispatch event to notify connection simulator of successful SSO retry
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('sso-retry-success'));
                    console.log('🔄 [LOBBY] Dispatched SSO retry success event');
                }
            } catch (error) {
                console.error('🔄 [LOBBY] Session reconnect failed:', error);
            }
        }
    };

    private resetConnectionSimulatorState = () => {
        try {
            // Reset LobbyStore connection attempt counter
            const lobbyStore = sharedContainer.get(LobbyStore);
            if (lobbyStore) {
                lobbyStore.tryToConnectCount = 0;
                console.log('🔄 [LOBBY] Reset LobbyStore connection attempt counter');
            }

            // Try to reset connection simulator if available
            try {
                const { useConnectionSimulator } = require('../simulator/hooks/use-connection-simulator');
                // Note: This is a hook, so we can't call it directly here
                // The reset will be handled by the simulator component itself
                console.log('🔄 [LOBBY] Connection simulator reset will be handled by simulator component');
            } catch (error) {
                console.log('🔄 [LOBBY] Connection simulator not available, using fallback reset');
            }

            // Reset connection health service metrics if available
            const { ConnectionHealthService } = require('../games/game-base/services/connection-health-service');
            const healthService = ConnectionHealthService.getInstance();
            if (healthService) {
                healthService.resetMetrics();
                console.log('🔄 [LOBBY] Reset connection health service metrics');
            }

            // Reset connection configuration if available
            const { DynamicConnectionConfig } = require('../games/game-base/config/connection-config');
            const configService = DynamicConnectionConfig.getInstance();
            if (configService) {
                configService.resetToDefault();
                console.log('🔄 [LOBBY] Reset connection configuration to default');
            }

            console.log('🔄 [LOBBY] Connection simulator state reset completed');
        } catch (error) {
            console.warn('🔄 [LOBBY] Could not reset connection simulator state:', error);
        }
    };

    private renderGames(context) {
        const { offerGames, selectedGameId, isSessionTimeout, isAuthenticated } = this.state;

        const renderGameContent = () => {
            if (isSessionTimeout) {
                return (
                    <GameDisconnectView
                        onReconnect={this.handleSessionReconnect}
                        isSSOFailure={true}
                        isLoading={this.props.isReconnecting}
                        language={context.language}
                        backgroundImage={blurBgGame}
                    />
                );
            }

            const hasGames = offerGames.length > 0;
            if (!hasGames || !isAuthenticated) {
                return <Loading />;
            }

            const selectedGame = offerGames.find((game) => game.gameId === selectedGameId) || offerGames[0];
            const gameMapInfo = gamePageMap[selectedGame.gameId];
            const namespace = gameMapInfo?.namespace;
            const GamePageComponent = gameMapInfo?.component || null;

            return (
                <>
                    <div className="c-match c-in-play">
                        <AppContextConsumer>
                            {({ language }) => GamePageComponent && <GamePageComponent namespace={namespace} language={language} />}
                        </AppContextConsumer>
                    </div>
                </>
            );
        };

        const content = renderGameContent();

        return <>{content}</>;
    }

    render() {
        return (
            <div className={styles['lobby']}>
                <AppContextConsumer>{(context) => this.renderGames(context)}</AppContextConsumer>
            </div>
        );
    }
}

export default LobbyComponent;
