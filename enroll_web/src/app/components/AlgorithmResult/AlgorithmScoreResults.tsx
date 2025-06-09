import React from 'react';
import AlgorithmResultsSection from './components/AlgorithmResultsSection';

export type StudentScore = {
    student: string;
    score: number;
    max_score: number;
}

export interface AlgorithmScoreResultsProps {
    scores?: StudentScore[];
};

const AlgorithmScoreResults: React.FC<AlgorithmScoreResultsProps> = ({ scores }) => {
    return (
        <AlgorithmResultsSection
            title="Scores Per Student"
        >
            {scores && scores.length > 0 ? (
                <>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white"></h2>
                    <div className="border rounded-lg overflow-hidden border-gray-200 dark:border-gray-600">
                        <table className="w-full border-separate border-spacing-0 border-tools-table-outline">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700">
                                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-gray-900 dark:text-white font-medium">Student</th>
                                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-gray-900 dark:text-white font-medium">Score</th>
                                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-gray-900 dark:text-white font-medium">Max Score</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800">
                                {scores.map(({ student, score, max_score }) => (
                                    <tr key={student} className="hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">{student}</td>
                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">{score}</td>
                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">{max_score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <p className="text-gray-600 dark:text-gray-300"> Scores will load when algorithm finishes... </p>
            ) }
        </AlgorithmResultsSection>
    );
}

export default AlgorithmScoreResults;