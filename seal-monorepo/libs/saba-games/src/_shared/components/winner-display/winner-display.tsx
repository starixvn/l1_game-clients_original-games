

import Style from './winner-display.module.scss';

export type IWinnerDisplayProps = {
    result?: any,
    resultText?: string,
    className?: string
};

export const WinnerDisplay: React.FC<IWinnerDisplayProps> = (props) => {
    const { result, resultText, className } = props;

    return (
        <div className={`${Style['winner-display']} ${className}`}>
            <p className={Style['winner-text']}>
                {result}
                <span className={Style['winner-text-separator']}>-</span>
                {resultText}
            </p>
        </div>
    );
};
