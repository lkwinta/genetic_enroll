'use client';

import { useRouter } from 'next/navigation';

import React, { useState, useEffect, Dispatch, SetStateAction, useContext } from 'react';
import { Upload, } from 'lucide-react';
import { FileObject } from './interfaces/File';
import DragDrop from './components/DragDrop';
import Papa from 'papaparse';
import { FilesContext } from '@/app/global_state';

const parseFile = (setFile: Dispatch<SetStateAction<FileObject | undefined>>, file?: FileObject) => {
    if (!file) return;
    if (file.status !== 'ready') return;

    file.file.text().then((content) => {
        const parseResult = Papa.parse(content, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            delimitersToGuess: [',', '\t', '|', ';'],
        });

        if (parseResult.errors.length === 0) {
            setFile((prev) => ({
                ...prev!,
                status: 'success',
                data: parseResult.data,
                rowCount: parseResult.data.length,
            }));
        } else {
            setFile((prev) => ({
                ...prev!,
                status: 'error',
                error: 'CSV parsing failed',
            }));
        }
    });
}

const CSVFileUpload: React.FC = () => {
    const {
        scheduleFile,
        setScheduleFile,
        preferencesFile,
        setPreferencesFile
    } = useContext(FilesContext);
    const router = useRouter();

    useEffect(() => parseFile(setScheduleFile, scheduleFile), [scheduleFile]);
    useEffect(() => parseFile(setPreferencesFile, preferencesFile), [preferencesFile]);
    
    const canStartAlgorithm = (scheduleFile && scheduleFile.status === 'success') || (preferencesFile && preferencesFile.status === 'success');

    return (
        <div className="content-center min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        Drop input CSV files for algorithm
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Upload size={16} />
                        Upload CSV Files
                    </div>
                </div>

                {/* File Upload Areas */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <DragDrop
                        title="Schedule CSV File"
                        description="Upload schedule CSV file"
                        file={scheduleFile}
                        onFileChange={setScheduleFile}
                        viewButtonEnabled={true}
                        viewButtonOnClick={() => {
                            if (scheduleFile) {
                                router.push(`/pages/timetable`);
                            }
                        }}
                    />
                    <DragDrop
                        title="Preferences CSV File"
                        description="Upload preferences CSV file"
                        file={preferencesFile}
                        onFileChange={setPreferencesFile}
                    />
                </div>
 
                {canStartAlgorithm && (
                    <div className="text-center mb-6">
                        <button
                            onClick={() => { }}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium"
                            type="button"
                        >
                            Start Algorithm
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CSVFileUpload;