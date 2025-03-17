import style from './balance.module.scss';

const AnimationBalance = ({winBet}) => {
    console.log("AnimationBalance", winBet);
    return (
        <div className={style['win-amount']}>
            {`+${winBet}`}
        </div>
    );
};

export default AnimationBalance;
