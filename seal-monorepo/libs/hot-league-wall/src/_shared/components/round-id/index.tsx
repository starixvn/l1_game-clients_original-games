import * as gc from '@sg/sg-game-client';
import Styles from './round-id.module.scss';

export interface IRoundIdProps {
    clientRoundId: number;
    roundState: string;
}

export const RoundId = (props: IRoundIdProps) => {
    const { clientRoundId, roundState } = props;
    const showRoundId = clientRoundId !== 0 && roundState;

    return(
            showRoundId && <div className={Styles['round-id']}>
                {gc.Translator.translate('Common.result_no')} {clientRoundId}
            </div>
    )
}
