import Styles from './reconnecting.module.scss';
import blurBgGame from '../../../assets/rng-soccer/blur-bg-game.png';

export const Loading: React.FC = () => {
    const imageSrc = typeof blurBgGame === 'string' ? blurBgGame : (blurBgGame as any).src;
    return (
        <div className={Styles['reconnecting-container']}>
            <img src={imageSrc} alt="Blurred background" />
            <div className={Styles['spinner']}></div>
        </div>
    );
};

export default Loading;
