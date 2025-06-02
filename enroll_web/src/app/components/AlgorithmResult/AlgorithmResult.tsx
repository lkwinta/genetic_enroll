'use client';

import React, {useEffect, useState} from 'react';

const AlgorithmResult: React.FC = () => {
    const [results, setResults] = useState<string[][] | null>(null);
    const [scores, setScores] = useState<number[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/evolve", {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch results");
                }

                const text = await response.text();
                const rows = text.split("\n").map(row => row.split(";"));
                setResults(rows);
            } catch (err: any) {
                setError(err.message);
            }
        };

        const fetchScores = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/score", {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch scores");
                }

                const scoresData = await response.json();
                setScores(scoresData);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchResults();
        fetchScores();
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Algorithm Results</h1>
            {error && <p className="text-red-500">{error}</p>}
            {results ? (
                <table className="table-auto w-full border-collapse border border-gray-300 mb-8">
                    <thead>
                    <tr>
                        {results[0].map((header, index) => (
                            <th key={index} className="border border-gray-300 px-4 py-2">
                                {header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {results.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
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