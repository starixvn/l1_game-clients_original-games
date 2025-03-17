import style from './Success.module.scss';

const AnimationBalance = ({winBet}) => {
    console.log("AnimationBalance", winBet);
    return (
        <div className={style['stake']}>
            {`-${winBet}`}
        </div>
    );
};

export default AnimationBalance;
