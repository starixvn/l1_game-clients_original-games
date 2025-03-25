

import Style from './winner-display.module.scss';

export type IWinnerDisplayProps = {
    result?: any,
    resultText?: string,
    className?: string,
    isShowSeparator?: boolean
};

export const WinnerDisplay: React.FC<IWinnerDisplayProps> = (props) => {
    const { result, resultText, className, isShowSeparator } = props;
    return (
        <div className={`${Style['winner-display']} ${className}`}>
            <p className={Style['winner-text']}>
                {result}
                {isShowSeparator ? <span className={Style['winner-text-separator']}>-</span> : ' '}
                {resultText}
            </p>
        </div>
    );
};
