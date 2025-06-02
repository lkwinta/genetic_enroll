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
import { FilesContext } from '@/app/global_state';
import {useRouter} from "next/navigation";

const Settings: React.FC = () => {
    const router = useRouter();
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

    const [isRunning, setIsRunning] = useState(false);
    const [algorithmSettings, setAlgorithmSettings] = useState<AlgorithmSettingsState>(defaultAlgorithmSettings);
    const [fitnessFunctionSettings, setFitnessFunctionSettings] = useState<FitnessFunctionSettingsState>(defaultFitnessFunctionSettings);
    const [performanceSettings, setPerformanceSettings] = useState<PerformanceSettingsState>(defaultPerformanceSettings);
    const {scheduleFile, preferencesFile} = useContext(FilesContext);
    
    const runAlgorithm = async () => {
        if (!scheduleFile || !preferencesFile) {
            console.error("Schedule file or preferences file is not set");
            return;
        }

        setIsRunning(true);

        try {
            const settings = {
                algorithmSettings,
                fitnessFunctionSettings,
                performanceSettings
            };

            const settingsResponse = await fetch("http://127.0.0.1:5000/settings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(settings),
            });

            if (!settingsResponse.ok) {
                console.error("Failed to save settings");
                setIsRunning(false);
                return;
            }

            const scheduleData = new FormData();
            scheduleData.append("file", scheduleFile.file);

            const scheduleResponse = await fetch("http://127.0.0.1:5000/upload/schedule", {
                method: "POST",
                body: scheduleData,
            });

            if (!scheduleResponse.ok) {
                console.error("Failed to upload schedule file");
                setIsRunning(false);
                return;
            }

            const preferencesData = new FormData();
            preferencesData.append("file", preferencesFile.file);

            const preferencesResponse = await fetch("http://127.0.0.1:5000/upload/preferences", {
                method: "POST",
                body: preferencesData,
            });

            if (!preferencesResponse.ok) {
                console.error("Failed to upload preferences file");
                setIsRunning(false);
                return;
            }

            const resultsResponse = await fetch("http://127.0.0.1:5000/evolve", {
                method: "GET",
            });

            if (resultsResponse.ok) {
                const blob = await resultsResponse.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.style.display = "none";
                a.href = url;
                a.download = "results.csv";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);

                router.push("/pages/results");
            } else {
                console.error("Failed to run algorithm");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        } finally {
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