import * as gc from "@sg/sg-game-client";
import { ROUND_STATE } from "@sg/sg-game-client/dist/game/rounds";
import type { RNGSoccerResult } from "../../type";

class GameStateService {
    private currentRoundState: string = '';

    handleRoundState(roundState: string): void {
        this.currentRoundState = roundState;
    }

    handleSettlement(finish: gc.GameServiceMessage.Finish): RNGSoccerResult | undefined {
        if (!finish || finish.result === undefined) {
            return undefined;
        }

        try {
            // The finish.result contains our JSON data as a string or object
            const finishData = typeof finish.result === 'string'
                ? JSON.parse(finish.result)
                : finish.result;

            // Check if we have the expected structure
            if (!finishData.finish || !finishData.finish.result || !finishData.finish.settlementResult) {
                return undefined;
            }

            // Map the new card format to the expected format
            const result: RNGSoccerResult = {
                homeScore: 0,
                awayScore: 0,
                homeCard: {
                    card: finishData.finish.result.home.rank,
                    type: finishData.finish.result.home.suit
                },
                awayCard: {
                    card: finishData.finish.result.away.rank,
                    type: finishData.finish.result.away.suit
                }
            };

            // Calculate scores based on the settlement result
            if (finishData.finish.settlementResult.home) {
                result.homeScore = 1;
                result.awayScore = 0;
            } else if (finishData.finish.settlementResult.away) {
                result.homeScore = 0;
                result.awayScore = 1;
            } else if (finishData.finish.settlementResult.draw) {
                result.homeScore = 0;
                result.awayScore = 0;
            }

            return this.validateResult(result) ? result : undefined;
        } catch (error) {
            console.error('Error parsing settlement result:', error);
            return undefined;
        }
    }

    handleGameHistory(history: gc.RoundHistories.IFirstJoinGameHistory): RNGSoccerResult | undefined {
        if (!history || !history.roundHistory || !history.roundHistory.result) {
            return undefined;
        }

        try {
            // Parse the history result which might contain the same finish data structure
            const historyData = typeof history.roundHistory.result === 'string'
                ? JSON.parse(history.roundHistory.result)
                : history.roundHistory.result;

            // Check if we have the finish format structure
            if (historyData.finish && historyData.finish.result && historyData.finish.settlementResult) {
                // Map the new card format to the expected format
                const result: RNGSoccerResult = {
                    homeScore: 0,
                    awayScore: 0,
                    homeCard: {
                        card: historyData.finish.result.home.rank,
                        type: historyData.finish.result.home.suit
                    },
                    awayCard: {
                        card: historyData.finish.result.away.rank,
                        type: historyData.finish.result.away.suit
                    }
                };

                // Calculate scores based on the settlement result
                if (historyData.finish.settlementResult.home) {
                    result.homeScore = 1;
                    result.awayScore = 0;
                } else if (historyData.finish.settlementResult.away) {
                    result.homeScore = 0;
                    result.awayScore = 1;
                } else if (historyData.finish.settlementResult.draw) {
                    result.homeScore = 0;
                    result.awayScore = 0;
                }

                return this.validateResult(result) ? result : undefined;
            } else {
                // Fall back to the old format if needed
                return this.validateResult(historyData) ? historyData : undefined;
            }
        } catch (error) {
            console.error('Error parsing game history result:', error);
            return undefined;
        }
    }

    validateResult(result: RNGSoccerResult): boolean {
        return (
            result !== undefined &&
            typeof result.homeScore === 'number' &&
            typeof result.awayScore === 'number' &&
            result.homeCard !== undefined &&
            result.awayCard !== undefined
        );
    }

    async showResult(hasAnimation: boolean,
        result?: RNGSoccerResult,
        settlementResult?: gc.GameServiceMessage.TSettlementResult,
    ) {
        if (!result) return;

        // Update the previous winning bet based on the settlement result
        if (settlementResult && this.currentRoundState == ROUND_STATE.LOCKING_BET) {
            // Find the winning bet choice (home, away, or draw)
            const winningBet = Object.entries(settlementResult).find(([_, value]) => Boolean(value))?.[0];
            // No setState here as it's not available on this service
        }
    }
}

export const gameStateService = new GameStateService(); 