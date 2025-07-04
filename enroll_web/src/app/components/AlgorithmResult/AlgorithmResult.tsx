'use client';

import React, { useEffect, useState, useRef, useContext} from 'react';
import AlgorithmScoreResults from './AlgorithmScoreResults';
import AlgorithmStatus, { Progress } from './AlgorithmStatus';
import { fetchFromBackend } from '@/app/utils/BackendController';
import { CSVType, DataContext, IndividualRowType, IndividualType } from '@/app/utils/ContextManager';
import Papa from 'papaparse';
import { FitnessHistory } from './components/AlgorithmFitnessPlot';
import { StudentScore } from './components/AlgorithmScoresHistogram';
import { SubjectScore } from './components/AlgorithmSubjectScoresPlot';
import AlgorithmSubjectScores from './AlgorithmSubjectScores';
import ErrorBanner from '../Error/ErrorBanner';

const AlgorithmResult: React.FC = () => {
    const [progress, setProgress] = useState<Progress>({
        status: 'unknown',
        current_epochs: 0,
        total_epochs: 0
    });
    const [studentScores, setStudentScores] = useState<StudentScore[] | undefined>(undefined);
    const [subjectScores, setSubjectScores] = useState<SubjectScore[] | undefined>(undefined);
    const [fitnessHistory, setFitnessHistory] = useState<FitnessHistory>([]);
    const [error, setError] = useState<string | null>(null);
    const [ready, setReady] = useState<boolean>(false);
    const { setIndividual } = useContext(DataContext);

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
            .then(data => setStudentScores(data.scores))
            .catch(err => setError(`Failed to fetch scores: ${err.message}`));

        fetchFromBackend("get_subject_scores")
            .then(data => setSubjectScores(data.scores))
            .catch(err => setError(`Failed to fetch subject scores: ${err.message}`));

        fetchIndividualData()
            .then(setIndividual)
            .catch(err => setError(`Failed to fetch individual data: ${err.message}`));
    }, [ready, setIndividual]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Algorithm Results</h1>
            {error && <ErrorBanner error={error} />}
            <AlgorithmStatus progress={progress} fitnessHistory={fitnessHistory} viewButton={ready}/>
            {ready && <AlgorithmSubjectScores scores={subjectScores} />}
            {ready && <AlgorithmScoreResults scores={studentScores} />}
        </div>
    );
};

async function fetchIndividualData(): Promise<IndividualType> {
    const response = await fetchFromBackend('get_best');
                
    const parseResult = Papa.parse<IndividualRowType>(response.individual.csvString, {
        header: true,
        newline: '\n',
        skipEmptyLines: true,
        dynamicTyping: true,
        delimitersToGuess: [',', '\t', '|', ';'],
    });
    
    if (parseResult.errors.length === 0) {
        return {
            fitness: response.fitness,
            individual: {
                type: response.individual.type as CSVType,
                csvData: parseResult.data
            }
        };
    } else {
        throw new Error(`Failed to parse individual data: ${parseResult.errors.map(e => e.message).join(', ')}`);
    }
}

export default AlgorithmResult;