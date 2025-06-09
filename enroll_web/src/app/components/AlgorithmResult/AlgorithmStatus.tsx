'use client'

import React from "react";
import AlgorithmFitnessPlot, { FitnessHistory } from "./components/AlgorithmFitnessPlot";
import AlgorithmResultsSection from "./components/AlgorithmResultsSection";
import { CSVType, DataContext, IndividualRowType } from "@/app/utils/ContextManager";
import { fetchFromBackend } from "@/app/utils/BackendController";
import { useRouter } from "next/navigation";
import Papa from "papaparse";

type ProgressStatus = 'running' | 'finished' | 'unknown';

export interface Progress {
    status: ProgressStatus;
    current_epochs: number;
    total_epochs: number;
}

export interface AlgorithmStatusProps {
    progress: Progress;
    fitnessHistory?: FitnessHistory;
    viewButton?: boolean;
}

const AlgorithmStatus: React.FC<AlgorithmStatusProps> = ({ progress, fitnessHistory, viewButton = false }) => {
    const router = useRouter();
   
    return (
        <AlgorithmResultsSection
            title="Algorithm Status"
            viewButton={viewButton}
            viewButtonText="View Full Results"
            viewButtonOnClick={async () => {
               router.push('/pages/individual');
            }}
        >
            <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 dark:text-white">Status: {progress.status}</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                    {progress.current_epochs} / {progress.total_epochs} epochs
                </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${progress.status === 'finished'
                        ? 'bg-green-600 dark:bg-green-500'
                        : 'bg-blue-600 dark:bg-blue-500'
                        }`}
                    style={{
                        width: progress.status === 'finished'
                            ? '100%'
                            : `${progress.total_epochs > 0 ? (progress.current_epochs / progress.total_epochs) * 100 : 0}%`
                    }}
                ></div>
            </div>
            <AlgorithmFitnessPlot fitnessHistory={fitnessHistory} />
        </AlgorithmResultsSection>
    );
}

export default AlgorithmStatus;