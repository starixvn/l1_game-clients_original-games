import * as gc from '@sg/sg-game-client';
import { RoundDot } from '../../../../_shared/components/dot';
import Styles from '../sedie.module.scss';
import { SeDieChoices } from '../type';

interface TooltipProps {
    roundId: number;
    choice: string;
    countRed: number;
    dotsTotal: number;
}

export const RoundHistoryTooltip: React.FC<TooltipProps> = ({ roundId, choice, countRed, dotsTotal }) => {
    const t = (key) => gc.Translator.translate(key, { languageId: gc.Translator.getCurrentLanguageId() });

    return (
        <div className={Styles['tooltip']}>
            <div className={Styles['tooltip-content']}>
                <div className={Styles['tooltip-title']}>#{roundId}</div>
                <div className={Styles['tooltip-body']}>
                    <div className={Styles['tooltip-item']}>
                        {t(`SeDie.glossary_${choice.toLowerCase()}`).toUpperCase()}
                        {' '}
                        <RoundDot choice={SeDieChoices.odd} size="small" />
                        {countRed}
                        <RoundDot choice={SeDieChoices.even} size="small" />
                        {dotsTotal - countRed}
                    </div>
                </div>
            </div>
        </div>
    );
}; 