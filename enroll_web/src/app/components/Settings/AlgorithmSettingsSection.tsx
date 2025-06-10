import React, {FC, Dispatch, SetStateAction} from "react";

import {
  AlgorithmSettingsState,
  updateSettingFactory,
  MutationType,
  SelectionType,
  CrossoverType
} from "./interfaces/AlgorithmSettings";
import SettingsSection from "./components/SettingsSection";
import NumberInput from "./components/SettingsNumberInput";
import { Zap } from "lucide-react";
import SliderInput from "./components/SettingsSliderInput";
import ToggleSwitch from "./components/SettingsToggleSwitch";
import Dropdown from "./components/SettingsDropdown";
import InfoCard from "./components/SettingsInfoCard";

interface AlgorithmSettingsProps {
  settings: AlgorithmSettingsState;
  setSettings: Dispatch<SetStateAction<AlgorithmSettingsState>>;
}

const AlgorithmSettingsSection: FC<AlgorithmSettingsProps> = ({ settings, setSettings}) => {
  const updateSetting = updateSettingFactory<AlgorithmSettingsState>(setSettings);

  return (
    <SettingsSection
      title="Core Algorithm Parameters"
      icon={<Zap className="text-blue-600" size={20} />}
    >
      <InfoCard
        type="warning"
        title="Performance Tips"
        message="Large population sizes and generation counts will significantly increase computation time. Consider using parallel processing for better performance with complex problems."
      />
      <div className="settings-group">
        <Dropdown
          label="Mutation Type"
          options={[
            { value: 'swap', label: 'Swap' },
            { value: 'chain_swap', label: 'Chain Swap' },
          ]}
          value={settings.mutationType}
          onChange={(value) => updateSetting('mutationType', value as MutationType)}
          description="Type of mutation applied to offspring"
        />
        <Dropdown
          label="Crossover Type"
          options={[
            { value: 'split', label: 'Split' },
            { value: 'fill', label: 'Fill' },
          ]}
          value={settings.crossoverType}
          onChange={(value) => updateSetting('crossoverType', value as CrossoverType)}
          description="Type of crossover applied between parents"
        />
      </div>

      <div className="settings-group">
        <Dropdown
          label="Selection Type"
          options={[
            { value: 'truncation', label: 'Truncation' },
            { value: 'tournament', label: 'Tournament' },
          ]}
          value={settings.selectionType}
          onChange={(value) => updateSetting('selectionType', value as SelectionType)}
          description="Method for selecting parents for reproduction"
        />
        {settings.selectionType === 'tournament' && <NumberInput
          enabled={settings.selectionType === 'tournament'}
          label="Tournament Size"
          value={settings.tournamentSize}
          onChange={(value) => updateSetting('tournamentSize', value)}
          min={2}
          max={20}
          description="Size of tournament for parent selection"
        />}
        </div>
        <div className="settings-group">
        <SliderInput
          label="Mutation Rate"
          value={settings.mutationRate}
          onChange={(value) => updateSetting('mutationRate', value)}
          description="Probability of mutation in offspring"
        />
        <SliderInput
          label="Crossover Rate"
          value={settings.crossoverRate}
          onChange={(value) => updateSetting('crossoverRate', value)}
          description="Probability of crossover between parents"
        />
        <SliderInput
          label="Elitism Rate"
          value={settings.elitismRate}
          onChange={(value) => updateSetting('elitismRate', value)}
          description="Percentage of best solutions preserved"
        />
      </div>

      <div className="settings-group">
        <NumberInput
          label="Max Generations"
          value={settings.generationsCount}
          onChange={(value) => updateSetting('generationsCount', value)}
          min={10}
          max={10000}
          description="Maximum number of generations to evolve"
        />
        <NumberInput
          label="Population Size"
          value={settings.populationSize}
          onChange={(value) => updateSetting('populationSize', value)}
          min={10}
          max={1000}
          description="Number of solutions in each generation"
        />
      </div>

      <div className="settings-group">
        <ToggleSwitch
          label="Enable Early Stopping"
          checked={settings.earlyStoppingEnabled}
          onChange={(checked) => updateSetting('earlyStoppingEnabled', checked)}
          description="Stop evolution if no improvement in stagnation epochs"
        />
        {settings.earlyStoppingEnabled && <NumberInput
          label="Early Stopping Stagnation Epochs"
          value={settings.earlyStoppingStagnationEpochs}
          enabled={settings.earlyStoppingEnabled}
          onChange={(value) => updateSetting('earlyStoppingStagnationEpochs', value)}
          min={10}
          max={500}
          description="Generations without improvement before stopping"
        />}
      </div>
    </SettingsSection>
  );
}

export default AlgorithmSettingsSection;