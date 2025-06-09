'use client';

import React, { useEffect, useState, useRef } from 'react';
import AlgorithmScoreResults, { StudentScore } from './AlgorithmScoreResults';
import AlgorithmStatus, { Progress } from './AlgorithmStatus';
import { fetchFromBackend } from '@/app/utils/BackendController';

const AlgorithmResult: React.FC = () => {
    const [progress, setProgress] = useState<Progress>({
        status: 'unknown',
        current_epochs: 0,
        total_epochs: 0
    });
    const [scores, setScores] = useState<StudentScore[] | undefined>(undefined);
    const [fitnessHistory, setFitnessHistory] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [ready, setReady] = useState<boolean>(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        intervalRef.current = setInterval(async () => {
            await fetchFromBackend("get_progress")
                .then(data => data.progress)
                .then(data => {
                    setProgress(data);

                    if (data.status === 'finished') {
                        setReady(true);
                        clearInterval(intervalRef.current!);
                    };
                })
                .catch(err => setError(`Failed to fetch progress: ${err.message}`));


            await fetchFromBackend("get_history")
                .then(data => setFitnessHistory(data.history))
                .catch(err => setError(`Failed to fetch fitness history: ${err.message}`));

        }, 2000);
    }, [])

    useEffect(() => () => {
        if (intervalRef.current)
            clearInterval(intervalRef.current);
    }, []);

    useEffect(() => {
        if (!ready) return;
        fetchFromBackend("get_student_scores")
            .then(data => setScores(data.scores))
            .catch(err => setError(`Failed to fetch scores: ${err.message}`));
    }, [ready]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Algorithm Results</h1>
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
            )}
            <AlgorithmStatus progress={progress} fitnessHistory={fitnessHistory} viewButton={ready}/>
            {ready && <AlgorithmScoreResults scores={scores} />}
        </div>
    );
};

export default AlgorithmResult;