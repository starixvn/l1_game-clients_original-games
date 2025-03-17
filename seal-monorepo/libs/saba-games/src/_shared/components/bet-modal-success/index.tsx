import style from './Success.module.scss';

const BetModalSuccess = ({totalStake}) => {
    return (
        <div className={style['stake']}>
            {`-${totalStake}`}
        </div>
    );
};

export default BetModalSuccess;
