import * as gc from '@sg/sg-game-client';
import { handle, observer, render } from '@sg/sg-observer';
import React from 'react';
import { configSharedContainer } from '../_shared/components/game-base/startup';
import { LobbyStore } from '../_shared/states/lobby';
import * as lobbyUtils from './utils';
import styles from './lobby.module.scss';
import { DropdownType } from '../_shared/components/all-tab-components/league-tab-dropdown';
import { LeagueTabDropdown } from "../_shared/components/all-tab-components/league-tab-dropdown";
import { AppContextConsumer } from '../appProvider';
import Loading from '../_shared/components/loading';
import { GameMatchTab } from '../_shared/components/all-tab-components/game-match-tab';
import { IOfferGame, ILobbyState } from './type';
import { GameListTab } from '../_shared/components/all-tab-components/game-list-tab';

@observer
class LobbyComponent extends React.PureComponent<any, ILobbyState> {
    private reRenderGameTimeout?: NodeJS.Timeout;

    constructor(props: { token: string }) {
        super(props);
        configSharedContainer();
        this.state = {
            offerGames: [],
            isRenderGame: true,
            leagueToogle: true,
            expandedGames: {},
            isAuthorized: false,
            selectedGameId: null
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

    async componentDidMount() {
        const { token } = this.props;

        this.sso({ token });
    }

    @handle(gc.Auth.AuthHandlers.SSO)
    sso(ssoInfo: gc.Auth.ISSOInfo) {
        return ssoInfo;
    }

    @render(gc.Auth.AuthStore, (store) => store)
    handleAuthorized(store) {
        const { isAuthenticated } = store;
        this.setState({ isAuthorized: isAuthenticated });

        if (!store.isAuthorized) {
            this.connectLiveGateway();
            this.triggerRecheckIn();
        }
    }

    @handle(gc.GatewayConnection.GatewayConnectionHandlers.ConnectHandler)
    connectLiveGateway() { }

    @render(gc.Player.MainPlayerStore, (store) => store.offerGames)
    handleOfferGames(offerGames: IOfferGame[]) {
        if (offerGames?.length > 0) {
            const filteredOfferGames = lobbyUtils.getFilteredGames(offerGames);
            const expandedGames = filteredOfferGames.reduce((acc, game) => {
                acc[game.gameId] = true;
                return acc;
            }, {} as { [key: number]: boolean });
            this.setState({ offerGames: filteredOfferGames, expandedGames } as ILobbyState);

            if (!this.state.selectedGameId) {
                this.setState({ selectedGameId: filteredOfferGames[0].gameId });
            }
        }
    }

    @handle(gc.Auth.AuthHandlers.TriggerRecheckIn)
    triggerRecheckIn() { }


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

    updateLeagueToogle = (leagueToogle: boolean) => {
        this.setState({ leagueToogle });
    }

    handleTabClick = (gameId: number) => {
        this.setState({ selectedGameId: gameId });
    };

    private renderGames(context) {
        const { offerGames, leagueToogle, selectedGameId } = this.state;

        const renderGameContent = () => {
            const hasGames = offerGames.length > 0;

            if (!hasGames) {
                return <Loading />;
            }

            const selectedGame = offerGames.find(game => game.gameId === selectedGameId) || offerGames[0];
            
            return (
                <>
                    <GameListTab
                        offerGames={offerGames}
                        selectedGameId={selectedGameId}
                        onTabClick={this.handleTabClick}
                    />
                    <GameMatchTab
                        gameId={selectedGame.gameId}
                        className={styles['lobby-tabs']}
                        leagueToogle={leagueToogle}
                    />
                </>
            );
        }

        return (
            <>
                <LeagueTabDropdown
                    dropdownType={DropdownType.LEAGUE}
                    leagueToogle={leagueToogle}
                    updateLeagueToogle={this.updateLeagueToogle}
                />
                {renderGameContent()}
            </>
        );
    }

    render() {

        return (
            <div className={styles['lobby']}>
                <AppContextConsumer>
                    {(context) => this.renderGames(context)}
                </AppContextConsumer>
            </div>
        );
    }
}

export default LobbyComponent;
