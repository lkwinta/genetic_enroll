import React, { useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

export type FitnessHistory = number[];

export interface AlgorithmFitnessPlotProps {
    fitnessHistory?: FitnessHistory;
}

const AlgorithmFitnessPlot: React.FC<AlgorithmFitnessPlotProps> = ({ fitnessHistory }) => {
    const isDark = useRef<boolean>(false);

    useEffect(() => {
        isDark.current = window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    const lineColor = isDark.current ? 'rgb(96, 165, 250)' : 'rgb(59, 130, 246)';
    const textColor = isDark.current ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)';
    const gridColor = isDark.current ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
    const tooltipStyle: React.CSSProperties = {
        color: isDark.current ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)',
        backgroundColor: isDark.current ? 'rgba(10, 10, 10, 0.5)' : 'rgba(255, 255, 255, 0.8)',
        borderColor: isDark.current ? 'rgba(180, 180, 180, 0.5)' : 'rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-100 border border-gray-200 dark:border-gray-600">
            {fitnessHistory && fitnessHistory.length > 0 ? (
                <ResponsiveContainer width={'100%'} height={'100%'}>
                    <LineChart data={fitnessHistory.map((fitness, index) => ({ epoch: index + 1, fitness }))} margin={{ top: 12, right: 12, bottom: 12 }}>
                        <Line
                            type="monotone"
                            dataKey="fitness"
                            stroke={lineColor}
                            strokeWidth={2}
                            dot={false}/>
                        <XAxis 
                            dataKey="epoch" 
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