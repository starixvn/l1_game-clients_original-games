import style from './Success.module.scss';

const BetModalSuccess = ({totalStake}) => {
    return (
        <div className={style['stake-container']}>
            <span className={style['stake']}>{`-${totalStake}`}</span>
        </div>
    );
};

export default BetModalSuccess;
