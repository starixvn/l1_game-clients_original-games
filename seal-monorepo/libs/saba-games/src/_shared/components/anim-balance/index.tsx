import * as gc from "@sg/sg-game-client";
import style from './balance.module.scss';

const AnimationBalance = ({ winBet }) => {
    console.log(winBet)
    return (
        <div className={style['win-amount']}>
            ssss
            {`+${gc.FormatUtils.numberWithCommas(winBet)}`}
        </div>
    );
};

export default AnimationBalance;
