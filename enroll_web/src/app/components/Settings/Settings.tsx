'use client';

import React, { useContext, useState } from 'react';

import {
    Calculator,
    RotateCcw,
    Settings as SettingsIcon,
} from 'lucide-react';

import AlgorithmSettingsSection from './AlgorithmSettingsSection';
import FitnessFunctionSettingsSection from './FitnessFunctionSettingsSection';

import './styles/settings.css';
import { AlgorithmSettingsState, FitnessFunctionSettingsState, SettingsState } from './interfaces/AlgorithmSettings';
import { DataContext } from '@/app/utils/ContextManager';
import { useRouter } from "next/navigation";
import { sendToBackend } from '@/app/utils/BackendController';

const Settings: React.FC = () => {
    const router = useRouter();
    const defaultAlgorithmSettings: AlgorithmSettingsState = {
        mutationType: "swap",
        crossoverType: "row_scx",

        generationsCount: 50,
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
        balanceWeight: 0.3,
        fairnessWeight: 0.2,
        compactWeight: 0.1,
    }

    const [isRunning, setIsRunning] = useState(false);
    const [algorithmSettings, setAlgorithmSettings] = useState<AlgorithmSettingsState>(defaultAlgorithmSettings);
    const [fitnessFunctionSettings, setFitnessFunctionSettings] = useState<FitnessFunctionSettingsState>(defaultFitnessFunctionSettings);
    const {schedule, preferences} = useContext(DataContext);

    const runAlgorithm = async () => {
        if (!schedule || !preferences) {
            console.error("Schedule file or preferences file is not set");
            return;
        }

        setIsRunning(true);
        const settings: SettingsState = {
            algorithmSettings,
            fitnessFunctionSettings,
        };

        try {
            await sendToBackend('upload/settings', settings);
            await sendToBackend('upload/schedule', schedule);
            await sendToBackend('upload/preferences', preferences);
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
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="settings-header">
                    <SettingsIcon className={`text-primary `} size={32} />
                    <h1 className="text-3xl font-bold text-primary">
                        Genetic Algorithm Settings
                    </h1>
                </div>
                <p className="text-secondary">
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
            </div>
        </div>
    );
};


export default Settings;