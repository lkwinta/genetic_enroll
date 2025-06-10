import React, { useEffect, useRef, useState } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, Legend, Area } from 'recharts';
import SettingsSliderInput from '../../Settings/components/SettingsSliderInput';

import '@/app/components/Settings/styles/settings.css';

export type StudentScore = {
    student: string;
    score: number;
    max_score: number;
}

export interface AlgorithmScoresHistogramProps {
    scores?: StudentScore[];
}

const AlgorithmScoresHistogram: React.FC<AlgorithmScoresHistogramProps> = ({ scores }) => {
    const isDark = useRef<boolean>(false);
    const [binWidth, setBinWidth] = useState<number>(2);

    useEffect(() => {
        isDark.current = window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    const scoresHistogram: Record<number, number> = {};
    let maxWidth = 1;

    if (scores && scores.length > 0) {
        maxWidth = Math.max(...scores!.map(s => s.score));
        scores.forEach(({ score }) => {
            const bin = Math.floor(score / binWidth) * binWidth;
            scoresHistogram[bin] = (scoresHistogram[bin] || 0) + 1;
        });
    }

    const scoresArray = Object.entries(scoresHistogram).map(([score, count]) => ({
        score: score,
        count: count
    }));

    const barColor = isDark.current ? 'rgb(151, 191, 191)' : 'rgb(46, 179, 179)';
    const textColor = isDark.current ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)';
    const gridColor = isDark.current ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
    const tooltipStyle: React.CSSProperties = {
        color: isDark.current ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)',
        backgroundColor: isDark.current ? 'rgba(10, 10, 10, 0.5)' : 'rgba(255, 255, 255, 0.8)',
        borderColor: isDark.current ? 'rgba(180, 180, 180, 0.5)' : 'rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
    };

    return (
        <>
            <SettingsSliderInput 
                label="Bin Width"
                value={binWidth} 
                onChange={(value) => {setBinWidth(value)}}
                min={1}
                max={maxWidth}
                step={1}
            />
             <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 pt-10 h-110 border border-gray-200 dark:border-gray-600">
            
            {scores && scores.length > 0 ? (
                <ResponsiveContainer width={'100%'} height={'100%'}>
                    <ComposedChart data={scoresArray} margin={{ right: 12, bottom: 12 }}>
                        <Bar 
                            dataKey={"count"}
                            fill={barColor}
                        />
                        <XAxis 
                            dataKey="score" 
                            stroke={textColor} 
                            type="category">
                            <Label 
                                value="Scores"
                                offset={-10}
                                fill={textColor}
                                style={{ fontSize: '14px' }}
                                position={"insideBottom"}
                            />
                        </XAxis>
                        <YAxis stroke={textColor} domain={[0, 'dataMax + 1']}>
                            <Label 
                                value="Students with Score"
                                angle={-90}
                                offset={10}
                                fill={textColor}
                                style={{ fontSize: '14px' }}
                                position={"insideLeft"}
                            />
                        </YAxis>
                        <CartesianGrid stroke={gridColor} />
                        <Tooltip contentStyle={tooltipStyle}/>
                    </ComposedChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                    <div>
                        <div className="text-lg mb-2">Fitness History Chart</div>
                        <div className="text-sm">Chart will appear here when algorithm starts</div>
                    </div>
                </div>
            )}
        </div>
        </>
    );
}

export default AlgorithmScoresHistogram;