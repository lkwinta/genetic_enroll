'use client';

import { createContext, Dispatch, FC, SetStateAction, useState } from "react";

export type CSVType = 'schedule' | 'preferences' | 'individual';

export interface CSVInput {
    type: CSVType;
    csvData: any[];
}

export interface DataContext {
    schedule?: CSVInput;
    setSchedule: Dispatch<SetStateAction<CSVInput | undefined>>;

    preferences?: CSVInput;
    setPreferences: Dispatch<SetStateAction<CSVInput | undefined>>;

    individual?: CSVInput;
    setIndividual: Dispatch<SetStateAction<CSVInput | undefined>>;
}

export const DataContext = createContext<DataContext>({
    schedule: undefined,
    setSchedule: () => {},
    preferences: undefined,
    setPreferences: () => {},
    individual: undefined,
    setIndividual: () => {}
});

interface ContextProviderProps {
    children: React.ReactNode;
}

const ContextProvider: FC<ContextProviderProps> = ({ children }) => {
    const [schedule, setSchedule] = useState<CSVInput | undefined>(undefined);
    const [preferences, setPreferences] = useState<CSVInput | undefined>(undefined);
    const [individual, setIndividual] = useState<CSVInput | undefined>(undefined);

    return (
        <DataContext.Provider value={{
            schedule,
            setSchedule,
            preferences,
            setPreferences,
            individual,
            setIndividual
        }}>
            {children}
        </DataContext.Provider>
    );
};

export default ContextProvider;