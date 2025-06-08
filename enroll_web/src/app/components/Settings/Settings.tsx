'use client';

import React, { useContext, useState } from 'react';

import {
    Calculator,
    RotateCcw,
    Settings as SettingsIcon,
} from 'lucide-react';

import AlgorithmSettingsSection from './AlgorithmSettingsSection';
import FitnessFunctionSettingsSection from './FitnessFunctionSettingsSection';
import PerformanceSettingsSection from './PerformanceSettingsSection';

import './styles/settings.css';
import { AlgorithmSettingsState, FitnessFunctionSettingsState, PerformanceSettingsState } from './interfaces/AlgorithmSettings';
import { DataContext } from '@/app/utils/ContextManager';
import {useRouter} from "next/navigation";

async function sendToBackend(endpoint: string, json?: string) : Promise<string> {
    const response = await fetch(`http://localhost:5000/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: json,
    });

    if (!response.ok) {
        throw new Error(`Failed to send data to ${endpoint}: ${response.statusText}`);
    }

    return response.json();
}

const Settings: React.FC = () => {
    const router = useRouter();
    const defaultAlgorithmSettings: AlgorithmSettingsState = {
        mutationType: "A",
        crossoverType: "B",

        generationsCount: 1000,
        populationSize: 100,

        earlyStoppingEnabled: true,
        earlyStoppingStagnationEpochs: 50,

        selectionType: "truncation",
        tournamentSize: 5,

        crossoverRate: 0.8,
        mutationRate: 0.01,
        elitismRate: 0.1,
    };

    const defaultFitnessFunctionSettings: FitnessFunctionSettingsState = {
        preferenceWeight: 0.4,
        capacityWeight: 0.3,
        diversityWeight: 0.2,
        penaltyWeight: 0.1,
    }

    const defaultPerformanceSettings: PerformanceSettingsState = {
        enableParallelProcessing: true,
        threadCount: 4,
    };

    const [isRunning, setIsRunning] = useState(false);
    const [algorithmSettings, setAlgorithmSettings] = useState<AlgorithmSettingsState>(defaultAlgorithmSettings);
    const [fitnessFunctionSettings, setFitnessFunctionSettings] = useState<FitnessFunctionSettingsState>(defaultFitnessFunctionSettings);
    const [performanceSettings, setPerformanceSettings] = useState<PerformanceSettingsState>(defaultPerformanceSettings);
    const {schedule, preferences} = useContext(DataContext);

    const runAlgorithm = async () => {
        if (!schedule || !preferences) {
            console.error("Schedule file or preferences file is not set");
            return;
        }

        setIsRunning(true);
        const settings = {
            algorithmSettings,
            fitnessFunctionSettings,
            performanceSettings
        };

        try {
            await sendToBackend('settings', JSON.stringify(settings));
            await sendToBackend('upload/schedule', JSON.stringify(schedule));
            await sendToBackend('upload/preferences', JSON.stringify(preferences));
            await sendToBackend('start_evolution')

            router.push('/pages/results');
        } catch (error: unknown) {
            console.log("Error sending data to backend:", (error as Error).message);
            setIsRunning(false);
        } 
    };

    const resetSettings = () => {
        setAlgorithmSettings(defaultAlgorithmSettings);
        setFitnessFunctionSettings(defaultFitnessFunctionSettings);
        setPerformanceSettings(defaultPerformanceSettings);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="settings-header">
                    <SettingsIcon className={`settings-text-primary `} size={32} />
                    <h1 className="text-3xl font-bold settings-text-primary">
                        Genetic Algorithm Settings
                    </h1>
                </div>
                <p className="settings-text-secondary">
                    Configure parameters for student assignment optimization with preferences
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8 justify-between">
                <button
                    onClick={resetSettings}
                    className="settings-button-secondary settings-action-button"
                >
                    <RotateCcw size={16} />
                    Reset to Defaults
                </button>

                <button
                    onClick={runAlgorithm}
                    disabled={isRunning}
                    className="settings-button-primary settings-action-button disabled:opacity-50"
                >
                    <Calculator size={16} />
                    {isRunning ? 'Running...' : 'Run Algorithm'}
                </button>
            </div>

            <div className="space-y-6">
                <AlgorithmSettingsSection settings={algorithmSettings} setSettings={setAlgorithmSettings} />
                <FitnessFunctionSettingsSection settings={fitnessFunctionSettings} setSettings={setFitnessFunctionSettings} />
                <PerformanceSettingsSection settings={performanceSettings} setSettings={setPerformanceSettings} />
            </div>
        </div>
    );
};


export default Settings;