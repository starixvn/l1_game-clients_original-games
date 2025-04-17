import * as gc from '@sg/sg-game-client';
import styles from './fish-prawn-crab-round-history.module.scss';
import Tooltip from '../../../../_shared/components/tooltip/tooltip';
import { FishPrawnCrabChoices } from '../type';

interface TooltipProps {
    roundId: number;
    winner: FishPrawnCrabChoices;
    symbols: FishPrawnCrabChoices[];
}

export const FishPrawnCrabRoundHistoryTooltip: React.FC<TooltipProps> = ({
    roundId,
    winner,
    symbols
}) => {
    const t = (key) => gc.Translator.translate(key, { languageId: gc.Translator.getCurrentLanguageId() });

    return (
        <Tooltip className={styles['tooltip']} roundId={roundId}>
            <span>{t(`FishPrawnCrab.${winner}`).toUpperCase()} ({symbols.join(', ')})</span>
        </Tooltip>
    );
}; 