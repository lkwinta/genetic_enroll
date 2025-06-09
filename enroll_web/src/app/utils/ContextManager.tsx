'use client';

import { createContext, Dispatch, FC, SetStateAction, useState } from "react";

export type CSVType = 'schedule' | 'preferences' | 'individual';

export type ScheduleRowType = {
    subject: string;
    specialization: string;
    type: string;
    "": number;
    group_id: number;
    teacher: string;
    classroom: string;
    week: string;
    day: string;
    start_time: string;
}

export type PreferencesRowType = {
    student_id: string,
    subject: string,
    group_id: number, 
    preference: number
}

export type IndividualRowType = {
    "": string; // This is student_id
} & Record<string, number>;

export interface CSVInput<RowType> {
    type: CSVType;
    csvData: RowType[];
}

type IndividualType = {
    fitness: number;
    individual: CSVInput<IndividualRowType>;
}

export interface DataContext {
    schedule?: CSVInput<ScheduleRowType>;
    setSchedule: Dispatch<SetStateAction<CSVInput<ScheduleRowType> | undefined>>;

    preferences?: CSVInput<PreferencesRowType>;
    setPreferences: Dispatch<SetStateAction<CSVInput<PreferencesRowType> | undefined>>;

    individual?: IndividualType;
    setIndividual: Dispatch<SetStateAction<IndividualType | undefined>>;
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
    const [schedule, setSchedule] = useState<CSVInput<ScheduleRowType> | undefined>(undefined);
    const [preferences, setPreferences] = useState<CSVInput<PreferencesRowType> | undefined>(undefined);
    const [individual, setIndividual] = useState<IndividualType | undefined>(undefined);

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