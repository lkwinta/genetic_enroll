'use client';

import { createContext, Dispatch, FC, SetStateAction, useState } from "react";
import { FileObject } from "./components/FileUpload/interfaces/File";

export interface IFilesContext {
    scheduleFile?: FileObject;
    setScheduleFile: Dispatch<SetStateAction<FileObject | undefined>>;

    preferencesFile?: FileObject;
    setPreferencesFile: Dispatch<SetStateAction<FileObject | undefined>>;
}

export const FilesContext = createContext<IFilesContext>({
    scheduleFile: undefined,
    setScheduleFile: () => {},
    preferencesFile: undefined,
    setPreferencesFile: () => {}
});

interface StateComponentProps {
    children: React.ReactNode;
}

const StateComponent: FC<StateComponentProps> = ({ children }) => {
    const [scheduleFile, setScheduleFile] = useState<FileObject | undefined>(undefined);
    const [preferencesFile, setPreferencesFile] = useState<FileObject | undefined>(undefined);

    return (
        <FilesContext.Provider value={{
            scheduleFile,
            setScheduleFile,
            preferencesFile,
            setPreferencesFile
        }}>
            {children}
        </FilesContext.Provider>
    );
};

export default StateComponent;