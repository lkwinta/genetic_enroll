import React, { useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, Legend } from 'recharts';

export type FitnessHistory = {
    generation: number;
    max_fitness: number;
    min_fitness: number;
    avg_fitness: number;
    best_student_preference: number;
}[];

export interface AlgorithmFitnessPlotProps {
    fitnessHistory?: FitnessHistory;
}

const AlgorithmFitnessPlot: React.FC<AlgorithmFitnessPlotProps> = ({ fitnessHistory }) => {
    const isDark = useRef<boolean>(false);

    useEffect(() => {
        isDark.current = window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    const maxLineColor = isDark.current ? 'rgb(239, 68, 68)' : 'rgb(220, 38, 38)';
    const minLineColor = isDark.current ? 'rgb(250, 204, 21)' : 'rgb(234, 179, 8)';
    const avgLineColor = isDark.current ? 'rgb(34, 197, 94)' : 'rgb(22, 163, 74)';
    const bestStudentPreferenceColor = isDark.current ? 'rgb(59, 130, 246)' : 'rgb(37, 99, 235)';
    const textColor = isDark.current ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)';
    const gridColor = isDark.current ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
    const tooltipStyle: React.CSSProperties = {
        color: isDark.current ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)',
        backgroundColor: isDark.current ? 'rgba(10, 10, 10, 0.5)' : 'rgba(255, 255, 255, 0.8)',
        borderColor: isDark.current ? 'rgba(180, 180, 180, 0.5)' : 'rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-110 border border-gray-200 dark:border-gray-600">
            {fitnessHistory && fitnessHistory.length > 0 ? (
                <ResponsiveContainer width={'100%'} height={'100%'}>
                    <LineChart data={fitnessHistory} margin={{ right: 12, bottom: 12 }}>
                        <Line
                            type="monotone"
                            dataKey="min_fitness"
                            stroke={minLineColor}
                            strokeWidth={2}
                            dot={false}/>
                        <Line
                            type="monotone"
                            dataKey="avg_fitness"
                            stroke={avgLineColor}
                            strokeWidth={2}
                            dot={false}/>
                        <Line
                            type="monotone"
                            dataKey="max_fitness"
                            stroke={maxLineColor}
                            strokeWidth={2}
                            dot={false}/>
                        <Line
                            type="monotone"
                            dataKey="best_student_preference"
                            stroke={bestStudentPreferenceColor}
                            strokeWidth={2}
                            dot={false}/>
                        <XAxis 
                            dataKey="generation" 
                            stroke={textColor} 
                            type="number"
                        >
                            <Label 
                                value="Epoch"
                                offset={-10}
                                fill={textColor}
                                style={{ fontSize: '14px' }}
                                position={"insideBottom"}
                            />
                        </XAxis>
                        <YAxis stroke={textColor} domain={[0, 1]}>
                            <Label 
                                value="Fitness"
                                angle={-90}
                                offset={10}
                                fill={textColor}
                                style={{ fontSize: '14px' }}
                                position={"insideLeft"}
                            />
                        </YAxis>
                        <CartesianGrid stroke={gridColor} />
                        <Tooltip contentStyle={tooltipStyle}/>
                        <Legend
                            wrapperStyle={{ color: textColor }}
                            iconType="line"
                            formatter={(value: string) => <span style={{ color: textColor }}>{value}</span>}
                            verticalAlign='top'
                        />
                    </LineChart>
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
    );
}

export default AlgorithmFitnessPlot;