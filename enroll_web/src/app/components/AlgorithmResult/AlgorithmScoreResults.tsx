import React, { useContext } from 'react';
import AlgorithmResultsSection from './components/AlgorithmResultsSection';
import InfoCard from '@/app/components/InfoCard/InfoCard';
import { DataContext } from '@/app/utils/ContextManager';
import { useRouter } from 'next/navigation';
import AlgorithmScoresHistogram, { StudentScore } from './components/AlgorithmScoresHistogram';

export interface AlgorithmScoreResultsProps {
    scores?: StudentScore[];
};

const AlgorithmScoreResults: React.FC<AlgorithmScoreResultsProps> = ({ scores }) => {
    const { setSelectedStudent } = useContext(DataContext);
    const router = useRouter();
    
    const sortedScores = scores ? [...scores].sort((a, b) => b.score - a.score) : [];

    const handleScoreClick = (student: string) => {
        setSelectedStudent(student);
        router.push('/pages/student');
    };

    return (
        <AlgorithmResultsSection
            title="Scores Per Student"
        >
            <AlgorithmScoresHistogram scores={scores} />
            {sortedScores && sortedScores.length > 0 ? (
                <>
                    <InfoCard 
                        type='info' 
                        title='Scores' 
                        message="The scores are calculated based on the algorithm's evaluation of each student's timetable. Higher scores indicate better alignment with the algorithm's objectives." 
                    />
                    <InfoCard 
                        type='warning' 
                        title='' 
                        message="By clicking on a student's score, you can view their timetable and see how the algorithm has optimized their schedule." 
                    />
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
                                {sortedScores.map(({ student, score, max_score }) => (
                                    <tr key={student} className="hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors hover:cursor-pointer" onClick={() => handleScoreClick(student)}>
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