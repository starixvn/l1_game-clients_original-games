import * as gc from '@sg/sg-game-client';
import { BaccaratDot } from '../dot/baccarat-dot';
import Styles from './baccarat-round-history.module.scss';
import { Choices } from '../baccarat-helper';

interface TooltipProps {
    roundId: number;
    winningChoice: string;
    playerPoints: number;
    bankerPoints: number;
}

export const BaccaratRoundHistoryTooltip: React.FC<TooltipProps> = ({
    roundId,
    winningChoice,
    playerPoints,
    bankerPoints
}) => {
    const t = (key) => gc.Translator.translate(key, { languageId: gc.Translator.getCurrentLanguageId() });

    return (
        <div className={Styles['tooltip']}>
            <div className={Styles['tooltip-content']}>
                <div className={Styles['tooltip-title']}>#{roundId}</div>
                <div className={Styles['tooltip-body']}>
                    <div className={Styles['tooltip-item']}>
                        <div className={Styles['tooltip-points']}>
                            <span>{t(`Baccarat.glossary_${Choices.player}`).toUpperCase()}: {playerPoints}</span>
                            <span className={Styles['separator']}>-</span>
                            <span>{t(`Baccarat.glossary_${Choices.banker}`).toUpperCase()}: {bankerPoints}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 