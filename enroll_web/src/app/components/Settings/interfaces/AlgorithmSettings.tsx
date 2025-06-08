import {Dispatch, SetStateAction} from 'react';

export type MutationType = 'A' | 'B';
export type CrossoverType = 'A' | 'B'; 
export type SelectionType = 'truncation' | 'tournament';

export interface AlgorithmSettingsState {
    mutationType: MutationType;
    crossoverType: CrossoverType;

    generationsCount: number;
    populationSize: number;

    earlyStoppingEnabled: boolean;
    earlyStoppingStagnationEpochs: number;

    selectionType: SelectionType;
    tournamentSize: number;

    elitismRate: number;
    crossoverRate: number;
    mutationRate: number;
}

export interface FitnessFunctionSettingsState {
    preferenceWeight: number;
    capacityWeight: number;
    diversityWeight: number;
    penaltyWeight: number;
}

export interface PerformanceSettingsState {
    enableParallelProcessing: boolean;
    threadCount: number;
}

export function updateSettingFactory<T>(setFunction: Dispatch<SetStateAction<T>>){
    return (<K extends keyof T>(key: K, value: T[K]) => {
        setFunction((prev) => ({
            ...prev,
            [key]: value,
        }));
    });
};