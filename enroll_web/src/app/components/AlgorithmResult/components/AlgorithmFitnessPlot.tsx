import dynamic from 'next/dynamic';
import React, { useEffect, useRef } from 'react';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

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

    return (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-100 border border-gray-200 dark:border-gray-600">
            {fitnessHistory && fitnessHistory.length > 0 ? (
                <div className="w-full h-full">
                    <Plot
                        data={[
                            {
                                x: fitnessHistory.map((_, index) => index),
                                y: fitnessHistory,
                                type: 'scatter',
                                mode: 'lines',
                                line: { color: lineColor },
                                name: 'Fitness'
                            }
                        ]}
                        layout={{
                            title: { text: 'Fitness History', font: { color: textColor } },
                            xaxis: {
                                title: { text: 'Epoch', font: { color: textColor } },
                                color: textColor,
                                gridcolor: gridColor
                            },
                            yaxis: {
                                title: { text: 'Fitness', font: { color: textColor } },
                                color: textColor,
                                gridcolor: gridColor,
                                range: [0, 1],
                                dtick: 0.2
                            },
                            margin: { l: 50, r: 30, t: 40, b: 40 },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                        }}
                        style={{ width: '100%', height: '100%' }}
                        config={{ responsive: true, staticPlot: true }}
                    />
                </div>
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