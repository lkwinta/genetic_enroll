'use client';

import { DataContext } from '@/app/utils/ContextManager';
import React, { useContext, useEffect, useState } from 'react';
import { FileObject } from '@/app/components/FileUpload/interfaces/File';
import { parseIndividualIntoStudentsMap, parseScheduleIntoLessons } from '@/app/utils/TimetableParser';
import Timetable from '../Timetable/Timetable';
import Papa from 'papaparse';
import { stringify } from 'querystring';
import Plot from 'react-plotly.js';


const AlgorithmResult: React.FC = () => {
    const [results, setResults] = useState<boolean>(false);
    const [progress, setProgress] = useState<{ status: string, current_epoch: number, total_epochs: number }>({
        status: 'unknown',
        current_epoch: 0,
        total_epochs: 0
    });
    const [scores, setScores] = useState<number[] | null>(null);
    const [fitnessHistory, setFitnessHistory] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { individual, schedule, setIndividual } = useContext(DataContext);

    const { lessons, subjectColorMap } = parseScheduleIntoLessons(schedule!);
    let studentOnLessons: Record<string, string[]> = {}
    let interval: NodeJS.Timeout | null = null;

    useEffect(() => {
        if (individual) {
            setResults(true);
            studentOnLessons = parseIndividualIntoStudentsMap(individual);
        }
    }, [individual]);

    useEffect(() => {
        interval = setInterval(() => {
            fetch("http://localhost:5000/get_progress", {
                method: "GET",
            }).then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Failed to fetch progress");
                    }
                })
                .then(data => data['progress'])
                .then(data => {
                    setProgress({
                        status: data['status'],
                        current_epoch: data['current_epochs'],
                        total_epochs: data['total_epochs']
                    });

                    if (data['status'] === 'finished') {
                        clearInterval(interval!);
                    };
                });
            fetch("http://localhost:5000/get_history", {
                method: "GET",
            }).then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Failed to fetch scores");
                    }
                }
            ).then(data => {
                if (data['history']) {
                    setFitnessHistory(data['history']);
                } else {
                    setFitnessHistory([]);
                }
            });
    }, 2000);
    }, [])
    
    useEffect(() => () => {
        if (interval)
            clearInterval(interval);
    }, []);

    const isDark =  window.matchMedia("(prefers-color-scheme: dark)").matches;
    const lineColor = isDark ? 'rgb(96, 165, 250)' : 'rgb(59, 130, 246)';
    const textColor = isDark ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Algorithm Results</h1>
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
            )}
            {results ? (
                <Timetable
                    lessons={lessons}
                    header="Individual Inspect"
                    coloringFunction={(lesson) => subjectColorMap[lesson.subject] || 'teal'}
                    clickable={true}
                    onClick={(lesson) => {
                        const id = `${lesson.subject}-${lesson.group_id}`;
                        const students = studentOnLessons[id];
                        console.log(students);
                    }}
                />
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-600 p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Algorithm Status</h2>
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-lg font-medium text-gray-900 dark:text-white">Status: {progress.status}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                {progress.current_epoch} / {progress.total_epochs} epochs
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                    progress.status === 'finished' 
                                        ? 'bg-green-600 dark:bg-green-500' 
                                        : 'bg-blue-600 dark:bg-blue-500'
                                }`}
                                style={{ 
                                    width: progress.status === 'finished' 
                                        ? '100%' 
                                        : `${progress.total_epochs > 0 ? (progress.current_epoch / progress.total_epochs) * 100 : 0}%` 
                                }}
                            ></div>
                        </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-100 border border-gray-200 dark:border-gray-600">
                        {fitnessHistory.length > 0 ? (
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
                </div>
            )}
            {scores ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Scores Per Student</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700">
                                    <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white font-medium">Student</th>
                                    <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white font-medium">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scores.map((score, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white">{index + 1}</td>
                                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white">{score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                    <p className="text-gray-600 dark:text-gray-300">Loading scores...</p>
                </div>
            )}
        </div>
    );
};

export default AlgorithmResult;