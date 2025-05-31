'use client';

import React, { useState } from 'react';

import NumberInput from './components/SettingsNumberInput';
import SettingsSection from './components/SettingsSection';
import SliderInput from './components/SettingsSliderInput';
import { 
  Save, 
  RotateCcw, 
  Settings as SettingsIcon, 
  Target, 
  Zap, 
  Clock, 
  BarChart3,
} from 'lucide-react';
import GASettings from './interfaces/AlgorithmSettings';
import ToggleSwitch from './components/SettingsToggleSwitch';
import InfoCard from './components/SettingsInfoCard';

import './styles/settings.css';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<GASettings>({
    populationSize: 100,
    generations: 1000,
    crossoverRate: 0.8,
    mutationRate: 0.1,
    elitismRate: 0.1,
    tournamentSize: 5,
    convergenceThreshold: 0.001,
    maxStagnation: 100,
    preferenceWeight: 0.4,
    capacityWeight: 0.3,
    diversityWeight: 0.2,
    penaltyWeight: 0.1,
    enableParallelProcessing: true,
    enableAdaptiveMutation: false,
    enableIslandModel: false,
    islandCount: 4,
    migrationRate: 0.1,
    migrationInterval: 50
  });

  const [isSaving, setIsSaving] = useState(false);

  const updateSetting = <K extends keyof GASettings>(key: K, value: GASettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setSettings({
      populationSize: 100,
      generations: 1000,
      crossoverRate: 0.8,
      mutationRate: 0.1,
      elitismRate: 0.1,
      tournamentSize: 5,
      convergenceThreshold: 0.001,
      maxStagnation: 100,
      preferenceWeight: 0.4,
      capacityWeight: 0.3,
      diversityWeight: 0.2,
      penaltyWeight: 0.1,
      enableParallelProcessing: true,
      enableAdaptiveMutation: false,
      enableIslandModel: false,
      islandCount: 4,
      migrationRate: 0.1,
      migrationInterval: 50
    });
  };

  const saveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
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
            onClick={resetToDefaults}
            className={`px-4 py-2 rounded-lg settings-button-secondary font-medium transition-colors flex items-center gap-2`}
          >
            <RotateCcw size={16} />
            Reset to Defaults
          </button>
        </div>

        <div className="space-y-6">
          {/* Core Algorithm Parameters */}
          <SettingsSection
            title="Core Algorithm Parameters"
            icon={<Zap className="text-blue-600" size={20} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberInput
                label="Population Size"
                value={settings.populationSize}
                onChange={(value) => updateSetting('populationSize', value)}
                min={10}
                max={1000}
                description="Number of solutions in each generation"
              />
              <NumberInput
                label="Max Generations"
                value={settings.generations}
                onChange={(value) => updateSetting('generations', value)}
                min={10}
                max={10000}
                description="Maximum number of generations to evolve"
              />
              <NumberInput
                label="Tournament Size"
                value={settings.tournamentSize}
                onChange={(value) => updateSetting('tournamentSize', value)}
                min={2}
                max={20}
                description="Size of tournament for parent selection"
              />
              <NumberInput
                label="Max Stagnation"
                value={settings.maxStagnation}
                onChange={(value) => updateSetting('maxStagnation', value)}
                min={10}
                max={500}
                description="Generations without improvement before stopping"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <SliderInput
                label="Crossover Rate"
                value={settings.crossoverRate}
                onChange={(value) => updateSetting('crossoverRate', value)}
                description="Probability of crossover between parents"
              />
              <SliderInput
                label="Mutation Rate"
                value={settings.mutationRate}
                onChange={(value) => updateSetting('mutationRate', value)}
                description="Probability of mutation in offspring"
              />
              <SliderInput
                label="Elitism Rate"
                value={settings.elitismRate}
                onChange={(value) => updateSetting('elitismRate', value)}
                description="Percentage of best solutions preserved"
              />
              <SliderInput
                label="Convergence Threshold"
                value={settings.convergenceThreshold}
                onChange={(value) => updateSetting('convergenceThreshold', value)}
                min={0.0001}
                max={0.1}
                step={0.0001}
                description="Minimum improvement required to continue"
              />
            </div>
          </SettingsSection>

          {/* Fitness Function Weights */}
          <SettingsSection
            title="Fitness Function Weights"
            icon={<Target className="text-green-600" size={20} />}
          >
            <InfoCard
              type="info"
              title="Weight Balance"
              message="Ensure all weights sum to 1.0 for optimal performance. Higher weights prioritize that aspect of the solution."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SliderInput
                label="Preference Weight"
                value={settings.preferenceWeight}
                onChange={(value) => updateSetting('preferenceWeight', value)}
                description="Weight for matching student preferences"
              />
              <SliderInput
                label="Capacity Weight"
                value={settings.capacityWeight}
                onChange={(value) => updateSetting('capacityWeight', value)}
                description="Weight for respecting group capacities"
              />
              <SliderInput
                label="Diversity Weight"
                value={settings.diversityWeight}
                onChange={(value) => updateSetting('diversityWeight', value)}
                description="Weight for maintaining group diversity"
              />
              <SliderInput
                label="Penalty Weight"
                value={settings.penaltyWeight}
                onChange={(value) => updateSetting('penaltyWeight', value)}
                description="Weight for constraint violation penalties"
              />
            </div>
            
            <div className={`p-3 rounded-lg settings-bg-tertiary`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium settings-text-secondary`}>
                  Total Weight:
                </span>
                <span className={`text-sm font-bold ${
                  Math.abs((settings.preferenceWeight + settings.capacityWeight + settings.diversityWeight + settings.penaltyWeight) - 1.0) < 0.01
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {(settings.preferenceWeight + settings.capacityWeight + settings.diversityWeight + settings.penaltyWeight).toFixed(2)}
                </span>
              </div>
            </div>
          </SettingsSection>

          {/* Advanced Features */}
          <SettingsSection
            title="Advanced Features"
            icon={<BarChart3 className="text-purple-600" size={20} />}
            defaultExpanded={false}
          >
            <div className="space-y-4">
              <ToggleSwitch
                label="Parallel Processing"
                checked={settings.enableParallelProcessing}
                onChange={(value) => updateSetting('enableParallelProcessing', value)}
                description="Enable multi-threaded evaluation for faster computation"
              />
              
              <ToggleSwitch
                label="Adaptive Mutation"
                checked={settings.enableAdaptiveMutation}
                onChange={(value) => updateSetting('enableAdaptiveMutation', value)}
                description="Automatically adjust mutation rate based on population diversity"
              />
              
              <ToggleSwitch
                label="Island Model"
                checked={settings.enableIslandModel}
                onChange={(value) => updateSetting('enableIslandModel', value)}
                description="Use multiple isolated populations with periodic migration"
              />
            </div>

            {settings.enableIslandModel && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <NumberInput
                  label="Island Count"
                  value={settings.islandCount}
                  onChange={(value) => updateSetting('islandCount', value)}
                  min={2}
                  max={10}
                  description="Number of isolated populations"
                />
                <SliderInput
                  label="Migration Rate"
                  value={settings.migrationRate}
                  onChange={(value) => updateSetting('migrationRate', value)}
                  description="Percentage of individuals migrating"
                />
                <NumberInput
                  label="Migration Interval"
                  value={settings.migrationInterval}
                  onChange={(value) => updateSetting('migrationInterval', value)}
                  min={10}
                  max={200}
                  description="Generations between migrations"
                />
              </div>
            )}
          </SettingsSection>

          {/* Performance Information */}
          <SettingsSection
            title="Performance Information"
            icon={<Clock className="text-orange-600" size={20} />}
            defaultExpanded={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg settings-bg-tertiary`}>
                <h4 className={`font-medium settings-text-primary mb-2`}>
                  Estimated Runtime
                </h4>
                <p className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>
                  ~{Math.ceil((settings.populationSize * settings.generations) / 10000)} min
                </p>
                <p className={`text-xs settings-text-muted mt-1`}>
                  Based on current settings
                </p>
              </div>
              
              <div className={`p-4 rounded-lg settings-bg-tertiary`}>
                <h4 className={`font-medium settings-text-primary  mb-2`}>
                  Memory Usage
                </h4>
                <p className={`text-2xl font-bold text-green-600 dark:text-green-400`}>
                  ~{Math.ceil(settings.populationSize * 0.1)} MB
                </p>
                <p className={`text-xs settings-text-muted  mt-1`}>
                  Approximate memory requirement
                </p>
              </div>
            </div>
            
            <InfoCard
              type="warning"
              title="Performance Tips"
              message="Large population sizes and generation counts will significantly increase computation time. Consider using parallel processing for better performance with complex problems."
            />
          </SettingsSection>
        </div>
      </div>
    </div>
  );
};


export default Settings;