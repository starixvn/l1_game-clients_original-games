import React from 'react';
import { FishPrawnCrabChoices } from '../type';
import styles from './fish-prawn-crab-dot.module.scss';

interface DotProps {
    choice: FishPrawnCrabChoices | 'next';
    size?: 'small' | 'medium' | 'large';
    value?: string;
    highlight?: boolean;
}

export default function FishPrawnCrabDot({ choice, size = 'medium', value, highlight = false }: DotProps) {
    return (
        <div className={`${styles.dot} ${styles[size]} ${highlight ? styles.highlight : ''}`}>
            <span>{value || choice}</span>
        </div>
    );
} 