import * as gc from '@sg/sg-game-client';
import { handle, observer, render } from '@sg/sg-observer';
import React from 'react';
import { configSharedContainer, sharedContainer } from '../_shared/components/game-base/startup';
import { LobbyStore } from '../_shared/states/lobby';
import * as lobbyUtils from './utils';
import styles from './lobby.module.scss';
import { AppContextConsumer } from '../appProvider';
import Loading from '../_shared/components/loading';
import { IOfferGame, ILobbyState } from './type';
import SessionTimeout from '../_shared/components/timeout';
import { reaction, autorun } from 'mobx';
import { gamePageMap } from '../_shared/utils/component-util';

// Direct access to monitor MainPlayerStore changes
(function patchMainPlayerStore() {
    try {
        const originalStore = gc.Player.MainPlayerStore;
        if (originalStore) {
            const originalSetOfferGames = originalStore.prototype.setOfferGames;
            if (originalSetOfferGames) {
                originalStore.prototype.setOfferGames = function (...args) {
                    const result = originalSetOfferGames.apply(this, args);
                    return result;
                };
            }
        }
    } catch (error) {
        console.error('[HotLeagueWall-Patch] Error patching MainPlayerStore:', error);
    }
})();

@observer
class LobbyComponent extends React.PureComponent<any, ILobbyState> {
    private reRenderGameTimeout?: NodeJS.Timeout;
    private offerGamesCheckInterval?: NodeJS.Timeout;
    private lastOfferGames: any = null;

    constructor(props: { token: string }) {
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

        if (this.offerGamesCheckInterval) {
            clearInterval(this.offerGamesCheckInterval);
            this.offerGamesCheckInterval = undefined;
        }
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<ILobbyState>, snapshot?: any): void {
        if (prevProps.token !== this.props.token) {
            this.sso({ token: this.props.token });
        }
    }

    componentDidMount() {
        const { token } = this.props;

        // Add direct subscription to AuthStore (since @render decorator isn't working)
        try {
            const authStore = sharedContainer.get(gc.Auth.AuthStore);
            if (authStore) {
                // Set up an immediate reaction to isAuthenticated changes
                reaction(
                    () => authStore.isAuthenticated,
                    (isAuthenticated) => {
                        this.handleIsAuthenticated(isAuthenticated);
                    },
                    { fireImmediately: true }
                );

                // Also manually check and trigger if needed
                if (authStore.isAuthenticated) {
                    this.handleIsAuthenticated(true);
                }
            }
        } catch (error) {
            console.error('[LobbyComponent-Debug] Error setting up AuthStore reaction:', error);
        }

        // Debug MainPlayerStore
        try {
            const mainPlayerStore = gc.Player.MainPlayerStore;

            // Set up polling interval to check for offer games changes
            this.offerGamesCheckInterval = setInterval(this.checkMainPlayerStore, 1000);

            // Add autorun as an alternative to reaction
            autorun(() => {
                try {
                    if (sharedContainer) {
                        const storeInstance = sharedContainer.get(gc.Player.MainPlayerStore);
                        if (storeInstance && storeInstance.offerGames) {
                            this.handleOfferGames(storeInstance.offerGames as IOfferGame[]);
                        }
                    }
                } catch (error) {
                    console.error('[LobbyComponent-HotLeagueWall] Error in autorun:', error);
                }
            });

        } catch (error) {
            console.error('[LobbyComponent-HotLeagueWall] Error accessing MainPlayerStore:', error);
        }

        this.sso({ token });

        // Force a manual check for authentication and offer games after a delay
        setTimeout(() => {
            this.checkMainPlayerStore();

            // Check if we need to force authentication state
            try {
                const authStore = sharedContainer.get(gc.Auth.AuthStore);
                if (authStore) {
                    if (authStore.isAuthenticated && !this.state.isAuthenticated) {
                        this.setState({ isAuthenticated: true });
                    }
                }
            } catch (error) {
                console.error('[LobbyComponent-Debug] Error checking AuthStore:', error);
            }
        }, 2000);
    }

    @handle(gc.Auth.AuthHandlers.SSO)
    sso(ssoInfo: gc.Auth.ISSOInfo) {
        // Add a delayed authentication check after SSO
        setTimeout(() => {
            try {
                const authStore = sharedContainer.get(gc.Auth.AuthStore);
                if (authStore) {
                    if (authStore.isAuthenticated && !this.state.isAuthenticated) {
                        this.handleIsAuthenticated(true);
                    }
                }

                // Also check connected state
                if (this.state.isAuthenticated) {
                    this.connectLiveGateway();
                }
            } catch (error) {
                console.error('[LobbyComponent-Debug] Error in post-SSO check:', error);
            }
        }, 500);

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

            // Additional actions when authenticated
            this.checkMainPlayerStore();

            // Force a refresh of state if needed
            setTimeout(() => {
                if (this.state.offerGames.length === 0) {
                    this.forceUpdate();
                }
            }, 1000);
        }
    }

    @handle(gc.GatewayConnection.GatewayConnectionHandlers.ConnectHandler)
    connectLiveGateway() {
        // Try to manually initiate connection if handler isn't working
        try {
            const connectionHandler = sharedContainer.get(gc.GatewayConnection.GatewayConnectionHandlers.ConnectHandler);
            if (connectionHandler && typeof connectionHandler.handle === 'function') {
                connectionHandler.handle();
            } else {
                // Try to trigger connection via any available means

                // Last resort, try direct container access
                const allRegistrations = (sharedContainer as any)._registry?._registrations;
                if (allRegistrations) {
                    // Just log what's available for debugging
                    Object.keys(allRegistrations).forEach(key => {
                        if (key.toLowerCase().includes('connect') || key.toLowerCase().includes('gateway')) {
                            // Found potential connection service
                        }
                    });
                }
            }

            // Since we're connected now, check for offer games again
            setTimeout(() => {
                this.checkMainPlayerStore();
            }, 1000);

        } catch (error) {
            console.error('[LobbyComponent-Debug] Error manually connecting to gateway:', error);
        }
    }

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

    private renderGames(context) {
        const { offerGames, leagueToogle, selectedGameId, isSessionTimeout, isAuthenticated, username } = this.state;

        // EMERGENCY FALLBACK: If authenticated but no games, try to get them directly
        if (isAuthenticated && offerGames.length === 0) {
            try {
                const maybeContainer = window['seal_shared_container'] || sharedContainer;
                let storeInstance: any = null;

                if (maybeContainer && maybeContainer.get) {
                    try {
                        storeInstance = maybeContainer.get(gc.Player.MainPlayerStore);
                    } catch (e) {
                        console.error('[LobbyComponent-Debug] Error getting store in emergency:', e);
                    }
                }

                if (storeInstance && storeInstance.offerGames && storeInstance.offerGames.length > 0) {
                    // Filter and set games immediately
                    const directOfferGames = storeInstance.offerGames as IOfferGame[];
                    const filteredOfferGames = lobbyUtils.getFilteredGames(directOfferGames);

                    if (filteredOfferGames.length > 0) {
                        // Create a local copy of variables before setting state
                        const localSelectedGameId = filteredOfferGames[0].gameId;

                        // Proper setState call instead of direct mutation
                        this.setState({
                            offerGames: filteredOfferGames,
                            selectedGameId: localSelectedGameId
                        }, () => {
                            // State updated with filtered games
                        });

                        const gameMapInfo = gamePageMap[localSelectedGameId];
                        const namespace = gameMapInfo?.namespace;
                        const GamePageComponent = gameMapInfo?.component || null;
                        // Return emergency render with the directly fetched games
                        return (
                            <>
                                <div className='c-match c-in-play'>
                                    <AppContextConsumer>
                                        {({ language }) =>
                                            GamePageComponent && (
                                                <GamePageComponent namespace={namespace} language={language} />
                                            )
                                        }
                                    </AppContextConsumer>
                                </div>
                            </>
                        );
                    }
                }
            } catch (error) {
                console.error('[LobbyComponent-Debug] EMERGENCY: Error in direct games load:', error);
            }
        }

        const renderGameContent = () => {
            if (isSessionTimeout) {
                return (
                    <SessionTimeout
                        token={this.props.token}
                        renewToken={this.props.renewToken}
                        language={this.props.language}
                        username={username}
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
                    <div className='c-match c-in-play'>
                        <AppContextConsumer>
                            {({ language }) =>
                                GamePageComponent && (
                                    <GamePageComponent namespace={namespace} language={language} />
                                )
                            }
                        </AppContextConsumer>
                    </div>
                </>
            );
        };

        const content = renderGameContent();

        return (
            <>
                {content}
            </>
        );
    }

    render() {
        return (
            <div className={styles['lobby']}>
                <AppContextConsumer>
                    {(context) => {
                        return this.renderGames(context);
                    }}
                </AppContextConsumer>
            </div>
        );
    }

    checkMainPlayerStore = () => {
        try {
            // Try to get the store instance directly
            const maybeContainer = window['seal_shared_container'] || sharedContainer;
            let foundStore: any = null;

            // Try different ways to get the store
            if (maybeContainer && maybeContainer.get) {
                try {
                    foundStore = maybeContainer.get(gc.Player.MainPlayerStore);
                } catch (e) {
                    console.error('[LobbyComponent-HotLeagueWall] Error getting store from container:', e);
                }
            }

            // Global fallback
            if (!foundStore && gc.Player.MainPlayerStore) {
                if (typeof gc.Player.MainPlayerStore === 'function') {
                    // Skip trying to instantiate - not needed and causes errors
                } else {
                    // It might be a singleton instance
                    foundStore = gc.Player.MainPlayerStore as any;
                }
            }

            if (foundStore) {
                const offerGames = foundStore.offerGames;

                if (offerGames &&
                    JSON.stringify(offerGames) !== JSON.stringify(this.lastOfferGames) &&
                    offerGames.length > 0) {

                    this.lastOfferGames = offerGames;
                    this.handleOfferGames(offerGames as IOfferGame[]);
                }
            }

            // If we have authentication but no games, try to force a re-render
            if (this.state.isAuthenticated && this.state.offerGames.length === 0) {
                this.forceUpdate();
            }
        } catch (error) {
            console.error('[LobbyComponent-HotLeagueWall] Error in checkMainPlayerStore:', error);
        }
    };
}

export default LobbyComponent;
