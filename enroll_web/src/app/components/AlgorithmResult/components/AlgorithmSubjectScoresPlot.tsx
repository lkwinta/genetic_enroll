import React, { useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

import '@/app/components/Settings/styles/settings.css';

export type SubjectScore = {
    subject: string;
    fitness: number;
};

export interface AlgorithmScoresHistogramProps {
    scores?: SubjectScore[];
}

const AlgorithmScoresHistogram: React.FC<AlgorithmScoresHistogramProps> = ({ scores }) => {
    const isDark = useRef<boolean>(false);

    useEffect(() => {
        isDark.current = window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

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
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 pt-10 h-110 border border-gray-200 dark:border-gray-600">
                {scores && scores.length > 0 ? (
                    <ResponsiveContainer width={'100%'} height={'100%'}>
                        <BarChart data={scores} margin={{ left: 50, right: 12, bottom: 12 }} layout={"vertical"}>
                            <Bar
                                dataKey={"fitness"}
                                fill={barColor}
                            />
                            <YAxis
                                dataKey="subject"
                                stroke={textColor}
                                type="category"
                                />
                                <XAxis
                                stroke={textColor}
                                domain={[0, 1]}
                                type="number"
                                >
                                    <Label
                                        value="Fitness Score"
                                        offset={-10}
                                        fill={textColor}
                                        style={{ fontSize: '14px' }}
                                        position={"insideBottom"}
                                    />
                            </XAxis>
                            <CartesianGrid stroke={gridColor} />
                            <Tooltip contentStyle={tooltipStyle} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                        <div>
                            <div className="text-lg mb-2">Fitness History Chart</div>
                            <div className="text-sm">Chart will appear here when algorithm results loads </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default AlgorithmScoresHistogram;