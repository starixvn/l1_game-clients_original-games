import * as gc from '@sg/sg-game-client';
import Styles from './big-small-round-history.module.scss';

interface TooltipProps {
    roundId: number;
    winner: string;
    diceValues: number[];
}

export const BigSmallRoundHistoryTooltip: React.FC<TooltipProps> = ({
    roundId,
    winner,
    diceValues
}) => {
    const t = (key) => gc.Translator.translate(key, { languageId: gc.Translator.getCurrentLanguageId() });
    const total = diceValues.reduce((sum, value) => sum + value, 0);

    return (
        <div className={Styles['tooltip']}>
            <div className={Styles['tooltip-content']}>
                <div className={Styles['tooltip-title']}>#{roundId}</div>
                <div className={Styles['tooltip-body']}>
                    <div className={Styles['tooltip-item']}>
                        <div className={Styles['tooltip-points']}>
                            <span>{t(`UnbalancedBigSmall4.${winner}`).toUpperCase()} ({diceValues.join('-')})</span>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 