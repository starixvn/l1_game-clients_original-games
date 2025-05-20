import * as gc from "@sg/sg-game-client";
import { Settlements } from '@sg/sg-game-client';
import { RoundHistoryStore } from "@sg/sg-game-client/dist/game/round-histories";
import { ROUND_STATE, RoundTimeStore } from "@sg/sg-game-client/dist/game/rounds";
import { SettlementStore } from "@sg/sg-game-client/dist/game/settlements";
import { render, handle, observer } from "@sg/sg-observer";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import { RNGSoccerResult, RNGSoccerChoices } from "../type";
import Styles from "./styles/rng-soccer-settlement.module.scss";
import homeDefaultLogo from '../../../../assets/rng-soccer/home-default-logo.svg';
import awayDefaultLogo from '../../../../assets/rng-soccer/away-default-logo.svg';
import cardBack from '../../../../assets/rng-soccer/cards/card-back.svg';

// Team mapping
const TEAM_INFO: Record<string, { fullName: string, shortName: string, primaryColor: string, secondaryColor: string }> = {
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

const DEFAULT_RESULT: RNGSoccerResult = {
    homeScore: 0,
    awayScore: 0,
    home: { rank: 0, suit: 0 },
    away: { rank: 0, suit: 0 }
};

const POP_UP_ANIMATION_DURATION = 0.3;

export interface IRNGSoccerSettlementResultState extends IStateObserver {
    result: RNGSoccerResult;
    roundState: string;
    isAnimationResult: boolean;
    isFinishShowResult: boolean;
    settlementResult: gc.GameServiceMessage.TSettlementResult;
    winningSymbols: string[];
    isResultUpdated: boolean;
    homeTeam: { name: string; logo: string; color?: string; };
    awayTeam: { name: string; logo: string; color?: string; };
    dispose: () => void;
}

export default class RNGSoccerSettlementResult extends ObserverComponent<IPropsObserver, IRNGSoccerSettlementResultState> {
    private roundTimeStore: RoundTimeStore;
    private roundHistoryStore: RoundHistoryStore;
    private settlementStore: SettlementStore;

    constructor(props: IPropsObserver) {
        super(props);
        this.roundTimeStore = gc.getContainer().get(RoundTimeStore);
        this.roundHistoryStore = gc.getContainer().get(RoundHistoryStore);
        this.settlementStore = gc.getContainer().get(SettlementStore);

        // Use abbreviations instead of full names
        const defaultHomeTeam = "MCI";
        const defaultAwayTeam = "ARS";

        this.state = {
            result: DEFAULT_RESULT,
            roundState: this.roundTimeStore.roundState,
            isAnimationResult: false,
            isFinishShowResult: false,
            settlementResult: {},
            winningSymbols: [],
            isResultUpdated: false,
            homeTeam: {
                name: TEAM_INFO[defaultHomeTeam]?.shortName || defaultHomeTeam,
                logo: homeDefaultLogo,
                color: TEAM_INFO[defaultHomeTeam]?.primaryColor
            },
            awayTeam: {
                name: TEAM_INFO[defaultAwayTeam]?.shortName || defaultAwayTeam,
                logo: awayDefaultLogo,
                color: TEAM_INFO[defaultAwayTeam]?.primaryColor
            },
            dispose: () => { }
        };
    }

    @render(RoundTimeStore, (store) => store.roundState)
    onRoundStateChange() {
        this.setState({
            roundState: this.roundTimeStore.roundState
        });
    }

    @render(RoundHistoryStore, (store) => store.histories)
    onResultChange(histories: gc.RoundHistories.RoundHistory[]) {
        if (!histories || histories.length === 0) return;
        const result = histories[0].result as RNGSoccerResult;
        if (!result) return;

        this.setState({
            result,
            isAnimationResult: true,
            isResultUpdated: true
        });

        setTimeout(() => {
            this.setState({
                isAnimationResult: false
            });
        }, POP_UP_ANIMATION_DURATION * 1000);
    }

    @render(SettlementStore, (store) => store.currentFinish, {
        fireImmediately: false,
    })
    onSettlementResultChange(currentFinish: gc.GameServiceMessage.Finish) {
        if (!currentFinish) return;
        const { result, settlementResult } = currentFinish;

        if (!result || !settlementResult) return;

        const winningSymbols = Object.entries(settlementResult)
            .filter(([_, value]) => value)
            .map(([key]) => key);

        this.setState({
            result: result as RNGSoccerResult,
            settlementResult,
            winningSymbols
        });
    }

    render() {
        const { result, isAnimationResult, homeTeam, awayTeam } = this.state;
        const hasResult = result && Object.keys(result).length > 0;
        const homeScore = result?.homeScore ?? 0;
        const awayScore = result?.awayScore ?? 0;

        return (
            <div className={Styles['wrapper-sport-middle']}>
                <div className={Styles['sport-team'] + ' ' + Styles['home-team']}>
                    <div className={Styles['sport-team-img']}>
                        <img src={homeTeam.logo} alt="home-team" />
                    </div>
                    <div
                        className={Styles['sport-team-name']}
                        style={{ color: homeTeam.color || '#fff' }}
                    >
                        {homeTeam.name}
                    </div>
                </div>

                <div className={Styles['sport-result']}>
                    <div className={Styles['container-result']}>
                        <div className={Styles['card-section']}>
                            <img src={cardBack} alt="card" />
                        </div>
                        <div className={Styles['result-section']}>
                            <div className={Styles['score']}>
                                <span>{homeScore}</span>
                            </div>
                            <div className={Styles['score']}>
                                <span>{awayScore}</span>
                            </div>
                        </div>
                        <div className={Styles['card-section']}>
                            <img src={cardBack} alt="card" />
                        </div>
                    </div>
                    <div className={Styles['timmer']}>
                        <div className={Styles['dots']}></div>
                    </div>
                </div>

                <div className={Styles['sport-team'] + ' ' + Styles['away-team']}>
                    <div className={Styles['sport-team-img']}>
                        <img src={awayTeam.logo} alt="away-team" />
                    </div>
                    <div
                        className={Styles['sport-team-name']}
                        style={{ color: awayTeam.color || '#fff' }}
                    >
                        {awayTeam.name}
                    </div>
                </div>
            </div>
        );
    }
} 