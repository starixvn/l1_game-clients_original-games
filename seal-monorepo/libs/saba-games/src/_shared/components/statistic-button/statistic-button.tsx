// statistic-button
import * as gc from '@sg/sg-game-client';
import Styles from './statistic-button.module.scss';
import classNames from 'classnames';

const StatisticButton = ({ isOpenStatistic ,handleToggle }) => {
    const statisticTitle = gc.Translator.translate("Common.statistic_title")
    const renderArrow = (isOpenStatistic: boolean) => {
        return (
            <i className={`${Styles["arrow-icon"]}`}>
                <svg
                    className={`${Styles["svg-icon"]}`}
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#78acff"
                >
                    <path d={isOpenStatistic ? "M18 9l-6 6-6-6" : "M6 15l6-6 6 6"} />
                </svg>
            </i>
        );
    };
    
    return (
        <div className={classNames(Styles["statistic-button"], "c-match__option")} onClick={handleToggle}>
            <a className="c-btn c-btn--more c-is-close" title="Expand">
                <span className="c-text">{statisticTitle}</span>
                {renderArrow(isOpenStatistic)}
                {/* <i className="c-icon c-icon--caret"></i> */}
            </a>
        </div>
    );
}


export default StatisticButton;