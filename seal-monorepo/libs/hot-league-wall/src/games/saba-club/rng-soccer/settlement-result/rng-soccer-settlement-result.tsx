import * as gc from "@sg/sg-game-client";
import { RoundHistoryStore } from "@sg/sg-game-client/dist/game/round-histories";
import { ROUND_STATE, RoundTimeStore } from "@sg/sg-game-client/dist/game/rounds";
import { SettlementStore } from "@sg/sg-game-client/dist/game/settlements";
import { observer, render } from "@sg/sg-observer";
import { ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import { setting } from "../game-settings";
import { ErrorBoundary } from "./components/error-boundary";
// import { Loading } from "./components/loading";
import { gameStateService } from "./services/game-state.service";
import Styles from "./styles/rng-soccer-settlement.module.scss";

import type { RNGSoccerResult } from '../type';
import type { IPropsObserver, IStateObserver } from '../../../../_shared/components/observer-component/observer-component';
import Loading from "libs/hot-league-wall/src/_shared/components/loading";
import homeDefaultLogo from '../../../../assets/rng-soccer/home-default-logo.svg';
import awayDefaultLogo from '../../../../assets/rng-soccer/away-default-logo.svg';
import cardBack from '../../../../assets/rng-soccer/cards/card-back.svg';
import styles from '../rng-soccer.module.scss';

// Import the card images dynamically
import cardFrontImg from '../../../../assets/rng-soccer/cards/card-front.svg';
// Import card images
import a from '../../../../assets/rng-soccer/cards/A.png';
import aRed from '../../../../assets/rng-soccer/cards/A-red.png';
import two from '../../../../assets/rng-soccer/cards/2.png';
import twoRed from '../../../../assets/rng-soccer/cards/2-red.png';
import three from '../../../../assets/rng-soccer/cards/3.png';
import threeRed from '../../../../assets/rng-soccer/cards/3-red.png';
import four from '../../../../assets/rng-soccer/cards/4.png';
import fourRed from '../../../../assets/rng-soccer/cards/4-red.png';
import five from '../../../../assets/rng-soccer/cards/5.png';
import fiveRed from '../../../../assets/rng-soccer/cards/5-red.png';
import six from '../../../../assets/rng-soccer/cards/6.png';
import sixRed from '../../../../assets/rng-soccer/cards/6-red.png';
import seven from '../../../../assets/rng-soccer/cards/7.png';
import sevenRed from '../../../../assets/rng-soccer/cards/7-red.png';
import eight from '../../../../assets/rng-soccer/cards/8.png';
import eightRed from '../../../../assets/rng-soccer/cards/8-red.png';
import nine from '../../../../assets/rng-soccer/cards/9.png';
import nineRed from '../../../../assets/rng-soccer/cards/9-red.png';
import ten from '../../../../assets/rng-soccer/cards/10.png';
import tenRed from '../../../../assets/rng-soccer/cards/10-red.png';
import j from '../../../../assets/rng-soccer/cards/J.png';
import jRed from '../../../../assets/rng-soccer/cards/J-red.png';
import q from '../../../../assets/rng-soccer/cards/Q.png';
import qRed from '../../../../assets/rng-soccer/cards/Q-red.png';
import k from '../../../../assets/rng-soccer/cards/K.png';
import kRed from '../../../../assets/rng-soccer/cards/K-red.png';

// Team mapping with team information
interface TeamInfo {
    fullName: string;
    shortName: string;
    primaryColor: string;
    secondaryColor: string;
}

export const TEAM_INFO: Record<string, TeamInfo> = {
    "LIV": { fullName: "Liverpool", shortName: "Liverpool", primaryColor: "#C8102E", secondaryColor: "#00B2A9" },
    "INT": { fullName: "Inter Milan", shortName: "Inter", primaryColor: "#0066B3", secondaryColor: "#000000" },
    "BAR": { fullName: "Barcelona", shortName: "Barca", primaryColor: "#CD122D", secondaryColor: "#004D98" },
    "PSG": { fullName: "Paris Saint-Germain", shortName: "PSG", primaryColor: "#004170", secondaryColor: "#DA291C" },
    "ARS": { fullName: "Arsenal", shortName: "Arsenal", primaryColor: "#EF0107", secondaryColor: "#063672" },
    "BAY": { fullName: "Bayern Munich", shortName: "Bayern", primaryColor: "#DC052D", secondaryColor: "#0066B2" },
    "RMA": { fullName: "Real Madrid", shortName: "Real", primaryColor: "#FFFFFF", secondaryColor: "#00529F" },
    "LEV": { fullName: "Bayer Leverkusen", shortName: "Leverkusen", primaryColor: "#E32221", secondaryColor: "#000000" },
    "ATM": { fullName: "Atletico Madrid", shortName: "Atletico", primaryColor: "#CB3524", secondaryColor: "#172E62" },
    "MCI": { fullName: "Manchester City", shortName: "Man.City", primaryColor: "#6CABDD", secondaryColor: "#1C2C5B" },
    "ATA": { fullName: "Atalanta", shortName: "Atalanta", primaryColor: "#1E71B8", secondaryColor: "#000000" },
    "NAP": { fullName: "Napoli", shortName: "Napoli", primaryColor: "#12A0D7", secondaryColor: "#003C8F" },
    "ATH": { fullName: "Athletico Bilbao", shortName: "Bilbao", primaryColor: "#EF1420", secondaryColor: "#000000" },
    "AVL": { fullName: "Aston Villa", shortName: "A.Villa", primaryColor: "#95BFE5", secondaryColor: "#7A003C" },
    "BEN": { fullName: "Benfica", shortName: "Benfica", primaryColor: "#E73331", secondaryColor: "#FFFFFF" },
    "SPO": { fullName: "Sporting", shortName: "Sporting", primaryColor: "#006335", secondaryColor: "#FFFFFF" },
    "NFO": { fullName: "Nottingham Forest", shortName: "N.Forest", primaryColor: "#DD0000", secondaryColor: "#FFFFFF" },
    "BOL": { fullName: "Bologna", shortName: "Bologna", primaryColor: "#1A2F48", secondaryColor: "#AB1F3A" },
    "ROM": { fullName: "AS Roma", shortName: "Roma", primaryColor: "#A31D21", secondaryColor: "#FFD700" },
    "JUV": { fullName: "Juventus", shortName: "Juventus", primaryColor: "#000000", secondaryColor: "#FFFFFF" }
};

// Team abbreviation array for easier reference
export const TEAMS = Object.keys(TEAM_INFO);

// Helper function to get team name from the abbreviation
const getTeamFullName = (abbreviation: string): string => {
    return TEAM_INFO[abbreviation]?.shortName || abbreviation;
};

// Helper function to get team primary color
const getTeamPrimaryColor = (abbreviation: string): string => {
    return TEAM_INFO[abbreviation]?.primaryColor || '#FFFFFF';
};

// Helper function to get card image path
const getCardImage = (card: number, type: number): string => {
    // Default to card back if card is 0 or invalid
    if (card <= 0 || card > 13) {
        return cardBack;
    }

    // Ensure type is either 0 (black) or 1 (red)
    const safeType = type === 1 ? 1 : 0;

    // Type: 0 = black (club/spade), 1 = red (heart/diamond)
    // Create a mapping for card values to their images
    const cardImages: Record<number, [string, string]> = {
        1: [a, aRed],
        2: [two, twoRed],
        3: [three, threeRed],
        4: [four, fourRed],
        5: [five, fiveRed],
        6: [six, sixRed],
        7: [seven, sevenRed],
        8: [eight, eightRed],
        9: [nine, nineRed],
        10: [ten, tenRed],
        11: [j, jRed],
        12: [q, qRed],
        13: [k, kRed]
    };

    try {
        // Return the appropriate card image based on type
        if (cardImages[card]) {
            return safeType === 1 ? cardImages[card][1] : cardImages[card][0];
        }
    } catch (e) {
        // Error getting card image
    }

    return cardFrontImg;
};

// Get team for a specific card value
const getTeamForCard = (card: number): string => {
    // Ensure the card value is between 1-13 (standardized playing card values)
    // Map to a team from the TEAMS array using modulo to handle any card value
    const teamIndex = (card - 1) % TEAMS.length;
    return TEAMS[teamIndex];
};

const DEFAULT_RESULT: RNGSoccerResult = {
    homeScore: 0,
    awayScore: 0,
    homeCard: { card: 0, type: 0 },
    awayCard: { card: 0, type: 1 },
};

interface TeamData {
    homeTeam: {
        name: string;
        logo: string;
        color: string;
    };
    awayTeam: {
        name: string;
        logo: string;
        color: string;
    };
}

interface IRNGSoccerSettlementResultState extends IStateObserver {
    result?: RNGSoccerResult;
    roundState: string;
    isAnimationResult: boolean;
    isLoading: boolean;
    error?: Error;
    isFinish: boolean;
    isFinishShowResult: boolean;
    isHideAllCards: boolean;
    teamData: TeamData;
}

@observer(setting.mainObserverNamespace)
export default class RNGSoccerSettlementResult extends ObserverComponent<IPropsObserver, IRNGSoccerSettlementResultState> {
    constructor(props: IPropsObserver) {
        super(props);

        // Use specific teams for default display
        const defaultHomeTeamAbbr = "MCI"; // Manchester City
        const defaultAwayTeamAbbr = "ARS"; // Arsenal

        this.state = {
            dispose: null,
            result: undefined,
            roundState: '',
            isAnimationResult: false,
            isLoading: true,
            error: undefined,
            isFinish: false,
            isFinishShowResult: false,
            isHideAllCards: false,
            teamData: {
                homeTeam: {
                    name: getTeamFullName(defaultHomeTeamAbbr),
                    logo: homeDefaultLogo,
                    color: getTeamPrimaryColor(defaultHomeTeamAbbr)
                },
                awayTeam: {
                    name: getTeamFullName(defaultAwayTeamAbbr),
                    logo: awayDefaultLogo,
                    color: getTeamPrimaryColor(defaultAwayTeamAbbr)
                }
            }
        };
    }

    // Update team data based on result
    private updateTeamData(result: RNGSoccerResult): TeamData {
        if (!result || !result.homeCard || !result.awayCard) {
            return this.state.teamData;
        }

        const homeTeamAbbr = getTeamForCard(result.homeCard.card);
        const awayTeamAbbr = getTeamForCard(result.awayCard.card);

        return {
            homeTeam: {
                name: getTeamFullName(homeTeamAbbr),
                logo: homeDefaultLogo, // In a real app, you'd map to actual team logos
                color: getTeamPrimaryColor(homeTeamAbbr)
            },
            awayTeam: {
                name: getTeamFullName(awayTeamAbbr),
                logo: awayDefaultLogo, // In a real app, you'd map to actual team logos
                color: getTeamPrimaryColor(awayTeamAbbr)
            }
        };
    }

    @render(gc.Settlements.SettlementStore, (store) => store.isFinishedShowResult)
    finishShowResult(isFinishedShowResult: boolean) {
        this.setState({ isFinishShowResult: isFinishedShowResult });
    }

    @render(RoundTimeStore, (store) => store.isStartingRound)
    private handleStartNewRound(isStartingRound: boolean): void {
        this.setState({ isHideAllCards: isStartingRound });
    }

    @render(RoundTimeStore, (store) => store.roundState)
    private handleRoundState(roundState: string): void {
        try {
            if (
                roundState === ROUND_STATE.STARTING_ROUND ||
                roundState === ROUND_STATE.PLACING_BET ||
                roundState === ROUND_STATE.LOCKING_BET
            ) {
                this.setState({ isFinish: false });
            }
            gameStateService.handleRoundState(roundState);
            this.setState({ roundState, isLoading: false, isFinishShowResult: false });
        } catch (error) {
            this.setState({ error: error as Error });
        }
    }

    @render(SettlementStore, (store) => store.currentFinish, {
        fireImmediately: false,
    })
    private handleCurrentFinish(currentFinish: gc.GameServiceMessage.Finish): void {
        try {
            // Get the result from the game state service
            const result = gameStateService.handleSettlement(currentFinish);

            // Only update state if we have a valid result
            if (result && gameStateService.validateResult(result)) {
                // Update team data based on the cards
                const teamData = this.updateTeamData(result);

                // Show cards with animation
                this.setState({
                    result,
                    teamData,
                    isAnimationResult: true,
                    isLoading: false,
                    isFinish: true,
                    isHideAllCards: false
                });

                // Optional: Add timer to trigger any card flip animations
                setTimeout(() => {
                    this.setState({ isAnimationResult: false });
                }, 500); // Animation duration in ms
            } else {
                // If we don't have a valid result, ensure we're not showing loading
                this.setState({
                    isLoading: false
                });
            }
        } catch (error) {
            this.setState({ error: error as Error });
        }
    }

    @render(RoundHistoryStore, (store) => store.firstJoinGameHistory)
    private handleJoinGameAndShowResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory): void {
        const { roundState } = this.state;

        if (roundState === ROUND_STATE.PLACING_BET || roundState === ROUND_STATE.LOCKING_BET) {
            return;
        }

        try {
            // Get the result from the game state service
            const result = gameStateService.handleGameHistory(firstJoinGameHistory);

            // Only update state if we have a valid result
            if (result && gameStateService.validateResult(result)) {
                // Update team data based on the cards
                const teamData = this.updateTeamData(result);

                this.setState({
                    result,
                    teamData,
                    isLoading: false,
                    isFinish: true,
                    isFinishShowResult: true
                });
            } else {
                // If we don't have a valid result, ensure we're not showing loading
                this.setState({
                    isLoading: false
                });
            }
        } catch (error) {
            this.setState({ error: error as Error });
        }
    }

    private renderScoreDisplay(): JSX.Element | null {
        const { result, isAnimationResult, isFinish, roundState, isFinishShowResult, isHideAllCards } = this.state;
        const language = this.props.language || gc.Translator.getCurrentLanguageId();

        if (!result || !isFinish || roundState === ROUND_STATE.PLACING_BET || roundState === ROUND_STATE.LOCKING_BET) {
            return (
                <div className={styles['result-section']}>
                    <div className={styles['result']}>
                        <span>{DEFAULT_RESULT.homeScore}</span>
                    </div>
                    <div className={styles['result']}>
                        <span>{DEFAULT_RESULT.awayScore}</span>
                    </div>
                </div>
            );
        }

        return (
            <div className={styles['result-section']}>
                <div className={`${styles['result']} ${isAnimationResult ? styles['score-pop-in'] : ''}`}>
                    <span>{result.homeScore}</span>
                </div>
                <div className={`${styles['result']} ${isAnimationResult ? styles['score-pop-in'] : ''}`}>
                    <span>{result.awayScore}</span>
                </div>
            </div>
        );
    }

    private renderCardImage(isHome: boolean): JSX.Element {
        const { result, isFinish, roundState, isHideAllCards, isAnimationResult } = this.state;

        // If no result or hiding cards, show card back
        if (!result || !isFinish || isHideAllCards ||
            roundState === ROUND_STATE.PLACING_BET ||
            roundState === ROUND_STATE.LOCKING_BET) {
            return (
                <div className={styles['card-section']}>
                    <img src={cardBack} alt="card" />
                </div>
            );
        }

        // Get the appropriate card data
        const cardData = isHome ? result.homeCard : result.awayCard;

        // Validate card data
        if (!cardData || typeof cardData.card !== 'number' || typeof cardData.type !== 'number') {
            return (
                <div className={styles['card-section']}>
                    <img src={cardBack} alt="card" />
                </div>
            );
        }

        const cardImage = getCardImage(cardData.card, cardData.type);

        return (
            <div className={styles['card-section']}>
                <img
                    src={cardImage}
                    alt={`${isHome ? 'home' : 'away'}-card`}
                    className={`${isAnimationResult ? Styles['card-flip'] : ''}`}
                />
            </div>
        );
    }

    private renderContent(): JSX.Element {
        const { isLoading, error, result, isFinish, roundState, teamData } = this.state;

        if (error) {
            throw error;
        }

        if (isLoading) {
            return <Loading />;
        }

        return (
            <div className={styles['wrapper-sport-middle']}>
                <div className={`${styles['sport-team']} ${styles['home-team']}`}>
                    <div className={styles['sport-team-img']}>
                        <img src={teamData.homeTeam.logo} alt="home-team" />
                    </div>
                    <div
                        className={styles['sport-team-name']}
                        style={{ color: teamData.homeTeam.color }}
                    >
                        {teamData.homeTeam.name}
                    </div>
                </div>
                <div className={styles['sport-result']}>
                    <div className={styles['container-result']}>
                        {this.renderCardImage(true)}
                        {this.renderScoreDisplay()}
                        {this.renderCardImage(false)}
                    </div>
                </div>
                <div className={`${styles['sport-team']} ${styles['away-team']}`}>
                    <div className={styles['sport-team-img']}>
                        <img src={teamData.awayTeam.logo} alt="away-team" />
                    </div>
                    <div
                        className={styles['sport-team-name']}
                        style={{ color: teamData.awayTeam.color }}
                    >
                        {teamData.awayTeam.name}
                    </div>
                </div>
            </div>
        );
    }

    render(): JSX.Element {
        return <ErrorBoundary>{this.renderContent()}</ErrorBoundary>;
    }
} 