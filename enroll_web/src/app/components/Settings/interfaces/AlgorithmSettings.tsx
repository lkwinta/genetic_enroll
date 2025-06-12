import {Dispatch, SetStateAction} from 'react';

export type MutationType = 'swap' | 'chain_swap';
export type CrossoverType = 'row_scx' | 'column_pmx';
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
    balanceWeight: number;
    fairnessWeight: number;
    compactWeight: number;
}

export interface SettingsState {
    algorithmSettings: AlgorithmSettingsState;
    fitnessFunctionSettings: FitnessFunctionSettingsState;
}

export function updateSettingFactory<T>(setFunction: Dispatch<SetStateAction<T>>){
    return (<K extends keyof T>(key: K, value: T[K]) => {
        setFunction((prev) => ({
            ...prev,
            [key]: value,
        }));
    });
};