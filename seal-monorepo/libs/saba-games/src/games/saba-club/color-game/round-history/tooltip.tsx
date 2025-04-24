import * as gc from '@sg/sg-game-client';
import styles from './color-game-round-history.module.scss';
import Tooltip from '../../../../_shared/components/tooltip/tooltip';
import { ColorGameChoices } from '../type';

interface TooltipProps {
    roundId: number;
    winner: ColorGameChoices;
    symbols: ColorGameChoices[];
}

export const ColorRoundHistoryTooltip: React.FC<TooltipProps> = ({
    roundId,
    winner,
    symbols
}) => {
    const t = (key) => gc.Translator.translate(key, { languageId: gc.Translator.getCurrentLanguageId() });

    return (
        <Tooltip className={styles['tooltip']} roundId={roundId}>
            <span>{t(`ColorGame.${winner}`).toUpperCase()} ({symbols.join(', ')})</span>
        </Tooltip>
    );
}; 