import { handle, render } from '@sg/sg-observer';
import * as gc from '@sg/sg-game-client';
import { RoundStore } from '@sg/sg-game-client/dist/game/rounds';
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds/round-time-store';
import { IGameBaseState } from '../interfaces';

/**
 * RoundHandler - Handles round state and timing
 */
export class RoundHandler<S extends IGameBaseState> {

    // -------------------------------------------------------------------------
    // ROUND STATE HANDLERS
    // -------------------------------------------------------------------------

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundState)
    renderCountDownTimerState(
        roundState: string,
        state: S,
        setState: (state: Partial<S>) => void,
        resetBettingPanel: () => void
    ) {
        if (roundState === ROUND_STATE.PLACING_BET) {
            setState({ isShowNextRoundMessage: false } as Partial<S>);
        }

        if (roundState === ROUND_STATE.LOCKING_BET || roundState === ROUND_STATE.SHOW_RESULT) {
            resetBettingPanel();
        }

        setState({ roundState } as Partial<S>);
    }

    @render(RoundStore, (store) => store.clientRoundId)
    handleRoundIdChange(
        roundId: number,
        setState: (state: Partial<S>) => void,
        processAuthorizationIfRoundMatches: (roundId: number) => void
    ) {
        setState({ roundId } as Partial<S>);
        processAuthorizationIfRoundMatches(roundId);
    }

    // -------------------------------------------------------------------------
    // BET TIMING METHODS
    // -------------------------------------------------------------------------

    handleBetOption(
        setState: (state: Partial<S>) => void,
        resetBettingPanel: () => void
    ) {
        resetBettingPanel();
        setState({ isShowNextRoundMessage: true } as Partial<S>);
        setTimeout(() => {
            setState({ isShowNextRoundMessage: false } as Partial<S>);
        }, 3000);
    }
}

export default RoundHandler; 