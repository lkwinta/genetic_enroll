'use client';

import { useRouter } from 'next/navigation';

import React, { useEffect, Dispatch, SetStateAction, useContext } from 'react';
import { Upload, } from 'lucide-react';
import { FileObject } from './interfaces/File';
import DragDrop from './components/DragDrop';
import Papa from 'papaparse';
import { FilesContext } from '@/app/utils/FileManager';

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

interface CSVFileUploadProps {
    setReady?: Dispatch<SetStateAction<boolean>>;
}

const CSVFileUpload: React.FC<CSVFileUploadProps> = ({ setReady }) => {
    const {
        scheduleFile,
        setScheduleFile,
        preferencesFile,
        setPreferencesFile,
        individualFile,
        setIndividualFile,
    } = useContext(FilesContext);
    const router = useRouter();

    useEffect(() => parseFile(setScheduleFile, scheduleFile), [scheduleFile]);
    useEffect(() => parseFile(setPreferencesFile, preferencesFile), [preferencesFile]);
    useEffect(() => parseFile(setIndividualFile, individualFile), [individualFile]);

    useEffect(() => {
        if (setReady) {
            setReady(
                (scheduleFile !== undefined && scheduleFile.status === 'success') &&
                (preferencesFile !== undefined && preferencesFile.status === 'success')
            );
        }
    }, [scheduleFile, preferencesFile]);
    

    return (
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
                            router.push(`/pages/schedule`);
                        }
                    }}
                />
                <DragDrop
                    title="Preferences CSV File"
                    description="Upload preferences CSV file"
                    file={preferencesFile}
                    onFileChange={setPreferencesFile}
                    viewButtonEnabled={true}
                    viewButtonOnClick={() => {
                        if (preferencesFile) {
                            router.push(`/pages/preferences`);
                        }
                    }}
                />
                {/* Just for debug TODO: Remove */}
                <DragDrop
                    title="Individual Debug Upload TODO: Remove"
                    description="Individual object CSV file TODO: Remove"
                    file={individualFile}
                    onFileChange={setIndividualFile}
                    viewButtonEnabled={true}
                    viewButtonOnClick={() => {
                        if (individualFile) {
                            router.push(`/pages/individual`);
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default CSVFileUpload;