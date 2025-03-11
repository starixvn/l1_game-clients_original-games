import * as gc from '@sg/sg-game-client';
import style from './Success.module.scss';

const BetModalSuccess = () => {
    return (
        <div className={style['success-modal']}>
            <div className={style['success-icon']}></div>
            {gc.Translator.t('Common.sucbet')}
        </div>
    );
};

export default BetModalSuccess;
