import React from 'react';
import * as gc from '@sg/sg-game-client';
import Styles from './rng-soccer-animations.module.scss';

interface ResultDisplayProps {
    result: gc.GameServiceMessage.TResult;
    winningSymbols: string[];
    namespace: string;
    language: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, winningSymbols, namespace, language }) => {
    const translate = (key: string) => gc.Translator.translate(key, { languageId: language });

    return (
        <div className={Styles['rng-soccer-result']}>
            {winningSymbols.map((symbol, index) => (
                <div key={index} className={Styles['result-item']}>
                    {translate(`${namespace}.result.${symbol}`)}
                </div>
            ))}
        </div>
    );
}; 