import * as gc from '@sg/sg-game-client';
import { RoundStore, RoundTimeStore } from '@sg/sg-game-client/dist/game/rounds';
import { render } from '@sg/sg-observer';
import Styles from '../game-base/game-base.module.scss';
import { IPropsObserver, IStateObserver, ObserverComponent } from '../observer-component/observer-component';
import { FunctionUtils } from '../../utils/funtion-utils';

export interface IRoundIdProps extends IPropsObserver {
    language: string;
}

export interface IRoundIdState extends IStateObserver {
    clientRoundId: number;
    roundState: string;
    loadCount: number;
}

export default class RoundId extends ObserverComponent<IRoundIdProps, IRoundIdState> {
    constructor(props: IRoundIdProps) {
        super(props);
        this.state = {
            dispose: null,
            clientRoundId: 0,
            roundState: '',
            loadCount: 0,
        };
    }

    @render(RoundTimeStore, (store) => store.roundState)
    renderRoundState(roundState: string) {
        this.setState({ roundState });
    }

    @render(RoundStore, (store) => store.clientRoundId)
    async renderRoundId(clientRoundId: number) {  
        /**
         * 目前每次重新載入，初始狀態都是 stopGameLoop -> 再切換到目前狀態(如 placingBet ...)
         * roundState: stopGameLoop , clientRoundId: 3575940
         * roundState: placingBet , clientRoundId: 3575941
         * 為了配合計時器同時切換狀態，更換 roundId 需要延遲兩秒
         * 只有當載入次數大於等於 2 時才延遲
         *  */  
        const initRenderCount = 2;
        if (this.state.loadCount >= initRenderCount) {
            await FunctionUtils.delay(2000);
        }
        
        this.setState({ 
            clientRoundId,
            loadCount: this.state.loadCount + 1
        });
    }

    render() {
        const { clientRoundId } = this.state;
        if (clientRoundId === 0) return <></>;
        return <div className={Styles['round-id']}> {gc.Translator.translate('Common.result_no')} {clientRoundId}</div>;
    }
}
