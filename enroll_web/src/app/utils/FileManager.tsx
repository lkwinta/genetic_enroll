'use client';

import { createContext, Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { FileObject } from "../components/FileUpload/interfaces/File";
import Papa from "papaparse";

export interface IFilesContext {
    scheduleFile?: FileObject;
    setScheduleFile: Dispatch<SetStateAction<FileObject | undefined>>;

    preferencesFile?: FileObject;
    setPreferencesFile: Dispatch<SetStateAction<FileObject | undefined>>;

    individualFile?: FileObject;
    setIndividualFile: Dispatch<SetStateAction<FileObject | undefined>>;
}

export const FilesContext = createContext<IFilesContext>({
    scheduleFile: undefined,
    setScheduleFile: () => {},
    preferencesFile: undefined,
    setPreferencesFile: () => {},
    individualFile: undefined,
    setIndividualFile: () => {}
});

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

interface StateComponentProps {
    children: React.ReactNode;
}

const StateComponent: FC<StateComponentProps> = ({ children }) => {
    const [scheduleFile, setScheduleFile] = useState<FileObject | undefined>(undefined);
    const [preferencesFile, setPreferencesFile] = useState<FileObject | undefined>(undefined);
    const [individualFile, setIndividualFile] = useState<FileObject | undefined>(undefined);

    useEffect(() => parseFile(setScheduleFile, scheduleFile), [scheduleFile]);
    useEffect(() => parseFile(setPreferencesFile, preferencesFile), [preferencesFile]);
    useEffect(() => parseFile(setIndividualFile, individualFile), [individualFile]);

    return (
        <FilesContext.Provider value={{
            scheduleFile,
            setScheduleFile,
            preferencesFile,
            setPreferencesFile,
            individualFile,
            setIndividualFile
        }}>
            {children}
        </FilesContext.Provider>
    );
};

export default StateComponent;