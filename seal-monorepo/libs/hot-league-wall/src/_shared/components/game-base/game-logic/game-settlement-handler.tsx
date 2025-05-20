import * as gc from '@sg/sg-game-client';
import { Settlements } from '@sg/sg-game-client';
import { handle, render } from '@sg/sg-observer';
import { SyncMemberSiteBalance } from '../../../utils/sync-member-site-balance';
import { IGameBaseState } from '../interfaces';

/**
 * GameSettlementHandler - Handles game settlement and bet validation
 */
export class GameSettlementHandler<S extends IGameBaseState> {

    // -------------------------------------------------------------------------
    // SETTLE BET HANDLERS
    // -------------------------------------------------------------------------

    @render(gc.Bet.BetStore, (store) => store.validBet)
    setIsValidBet(validBet: gc.Bet.IValidBet, setState: (state: Partial<S>) => void) {
        if (validBet?.value) {
            SyncMemberSiteBalance.getInstance().executeSyncBalance();
        }
    }

    @render(Settlements.SettlementStatusStore, (store) => store.settlementStatus, {
        fireImmediately: false,
    })
    assignStatus(settlementStatus: any, setState: (state: Partial<S>) => void) {
        setState({ statusSettlement: settlementStatus } as Partial<S>);
    }

    @render(Settlements.SettlementStore, (store) => store.currentFinish, {
        fireImmediately: false,
    })
    renderCurrentFinish(
        currentFinish: gc.GameServiceMessage.Finish,
        state: S,
        setState: (state: Partial<S>) => void,
        showResult: (
            hasAnimation: boolean,
            result?: gc.GameServiceMessage.TResult,
            settlementResult?: gc.GameServiceMessage.TSettlementResult,
        ) => Promise<void>,
        finishShowResult: () => void
    ) {
        if (!currentFinish) {
            return;
        }
        const { result, settlementResult } = currentFinish;

        if (!this.isValidResult(result, settlementResult)) {
            return;
        }
        setState({ isFinishShowResult: false } as Partial<S>);
        showResult(true, result, settlementResult).then(() => {
            finishShowResult();
        });
    }

    @handle(Settlements.SettlementUIHandlers.FinishedShowResult)
    finishShowResult(setState: (state: Partial<S>) => void) {
        setState({ isFinishShowResult: true } as Partial<S>);
    }

    // Helper methods
    isValidResult(result?: gc.GameServiceMessage.TResult, settlementResult?: gc.GameServiceMessage.TSettlementResult) {
        return !!result && !!settlementResult;
    }
}

export default GameSettlementHandler; 