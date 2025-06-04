'use client';

import { DataContext } from '@/app/utils/ContextManager';
import React, { useContext, useEffect, useState } from 'react';
import { FileObject } from '@/app/components/FileUpload/interfaces/File';
import { parseIndividualIntoStudentsMap, parseScheduleIntoLessons } from '@/app/utils/TimetableParser';
import Timetable from '../Timetable/Timetable';
import Papa from 'papaparse';


const AlgorithmResult: React.FC = () => {
    const [results, setResults] = useState<boolean>(false);
    const [scores, setScores] = useState<number[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { individual, schedule, setIndividual } = useContext(DataContext);

    const { lessons, subjectColorMap } = parseScheduleIntoLessons(schedule!);
    let studentOnLessons: Record<string, string[]> = {}
    
    useEffect(() => {
        if (individual) {
            setResults(true);
            studentOnLessons = parseIndividualIntoStudentsMap(individual);
        }
    }, [individual]);

    const interval = setInterval(() => {
        fetch("http://localhost:5000/get_progress", {
            method: "GET",
        }).then(response => {
            console.log("Fetching progress...");
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to fetch progress");
            }
        }).then(data => {
            console.log("Progress data:", data);
        });
    }, 1000);

    useEffect( () => () => {
        console.log("Cleaning up interval");
        clearInterval(interval);
    }, []);

    // useEffect(() => {
    //     const fetchResults = async () => {
    //         try {
    //             const response = await fetch("http://127.0.0.1:5000/evolve", {
    //                 method: "GET",
    //             });

    //             if (!response.ok) {
    //                 throw new Error("Failed to fetch results");
    //             }

    //             const blob = await response.blob();
    //             const newFile = new File([blob], "aaaaaaaaaaa.csv", { type: "text/csv" });
                
    //             const fileObj: FileObject = {
    //                 id: Math.random().toString(36).substr(2, 9),
    //                 file: newFile,
    //                 name: newFile.name,
    //                 size: formatFileSize(newFile.size),
    //                 status: 'ready'
    //             };

    //             setIndividualFile(fileObj);
    //         } catch (err: any) {
    //             setError(err.message);
    //         }
    //     };

    //     const fetchScores = async () => {
    //         try {
    //             const response = await fetch("http://127.0.0.1:5000/score", {
    //                 method: "GET",
    //             });

    //             if (!response.ok) {
    //                 throw new Error("Failed to fetch scores");
    //             }

    //             const scoresData = await response.json();
    //             setScores(scoresData);
    //         } catch (err: any) {
    //             setError(err.message);
    //         }
    //     };

    //     fetchResults();
    //     fetchScores();
    // }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Algorithm Results</h1>
            {error && <p className="text-red-500">{error}</p>}
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
                    }
                    }
                />
            ) : (
                <p>Loading results...</p>
            )}
            {scores ? (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Scores Per Student</h2>
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Student</th>
                                <th className="border border-gray-300 px-4 py-2">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((score, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2">{score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Loading scores...</p>
            )}
        </div>
    );
};

export default AlgorithmResult;