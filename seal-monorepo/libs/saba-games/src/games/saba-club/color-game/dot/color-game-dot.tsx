import { ColorGameChoices } from '../type';
import styles from './color-game-dot.module.scss';

interface DotProps {
    choice: ColorGameChoices | 'next';
    size?: 'small' | 'medium' | 'large';
    value?: string;
    highlight?: boolean;
}

export default function ColorGameDot({ choice, size = 'medium', value, highlight = false }: DotProps) {
    return (
        <div className={`${styles.dot} ${styles[size]} ${highlight ? styles.highlight : ''}`}>
            <span>{value || choice}</span>
        </div>
    );
} 