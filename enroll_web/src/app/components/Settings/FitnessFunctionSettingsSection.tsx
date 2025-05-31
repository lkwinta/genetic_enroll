import React, { Dispatch, SetStateAction, FC } from "react";
import { FitnessFunctionSettingsState, updateSettingFactory } from "./interfaces/AlgorithmSettings";

import { Target } from "lucide-react";

import SettingsSection from "./components/SettingsSection";
import InfoCard from "./components/SettingsInfoCard";
import SliderInput from "./components/SettingsSliderInput";

interface FitnessFunctionSettingsProps {
  settings: FitnessFunctionSettingsState;
  setSettings: Dispatch<SetStateAction<FitnessFunctionSettingsState>>;
}

const FitnessFunctionSettingsSection: FC<FitnessFunctionSettingsProps> = ({ settings, setSettings }) => {

    const updateSetting = updateSettingFactory<FitnessFunctionSettingsState>(setSettings);

    return (
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
    );
}

export default FitnessFunctionSettingsSection;