'use client';

import React, { useState, } from 'react';

import {
    Save,
    RotateCcw,
    Settings as SettingsIcon,
} from 'lucide-react';

import AlgorithmSettingsSection from './AlgroithmSettingsSection';
import FitnessFunctionSettingsSection from './FitnessFunctionSettingsSection';
import PerformanceSettingsSection from './PerformanceSettingsSection';

import './styles/settings.css';
import { AlgorithmSettingsState, FitnessFunctionSettingsState, PerformanceSettingsState } from './interfaces/AlgorithmSettings';

const Settings: React.FC = () => {
    const defaultAlgorithmSettings: AlgorithmSettingsState = {
        mutationType: "A",
        crossoverType: "B",

        generationsCount: 1000,
        populationSize: 100,

        earlyStoppingEnabled: true,
        earlyStoppingStagnationEpochs: 50,

        selectionType: "Truncation",
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

    const [isSaving, setIsSaving] = useState(false);
    const [algorithmSettings, setAlgorithmSettings] = useState<AlgorithmSettingsState>(defaultAlgorithmSettings);
    const [fitnessFunctionSettings, setFitnessFunctionSettings] = useState<FitnessFunctionSettingsState>(defaultFitnessFunctionSettings);
    const [performanceSettings, setPerformanceSettings] = useState<PerformanceSettingsState>(defaultPerformanceSettings);

    const saveSettings = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
    };

    const resetSettings = () => {
        setAlgorithmSettings(defaultAlgorithmSettings);
        setFitnessFunctionSettings(defaultFitnessFunctionSettings);
        setPerformanceSettings(defaultPerformanceSettings);
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 settings-bg-primary`}>
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <SettingsIcon className={`settings-text-primary `} size={32} />
                        <h1 className={`text-3xl font-bold settings-text-primary `}>
                            Genetic Algorithm Settings
                        </h1>
                    </div>
                    <p className={`settings-text-secondary `}>
                        Configure parameters for student assignment optimization with preferences
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-8">
                    <button
                        onClick={saveSettings}
                        disabled={isSaving}
                        className={`settings-button-primary px-4 py-2 rounded-lg  font-medium transition-colors flex items-center gap-2 disabled:opacity-50`}
                    >
                        <Save size={16} />
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                    <button
                        onClick={resetSettings}
                        className={`px-4 py-2 rounded-lg settings-button-secondary font-medium transition-colors flex items-center gap-2`}
                    >
                        <RotateCcw size={16} />
                        Reset to Defaults
                    </button>
                </div>

                <div className="space-y-6">
                    <AlgorithmSettingsSection settings={algorithmSettings} setSettings={setAlgorithmSettings} />
                    <FitnessFunctionSettingsSection settings={fitnessFunctionSettings} setSettings={setFitnessFunctionSettings} />
                    <PerformanceSettingsSection settings={performanceSettings} setSettings={setPerformanceSettings} />
                </div>
            </div>
        </div>
    );
};


export default Settings;