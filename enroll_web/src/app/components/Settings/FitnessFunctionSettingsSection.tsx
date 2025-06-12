import React, { Dispatch, SetStateAction, FC } from "react";
import { FitnessFunctionSettingsState, updateSettingFactory } from "./interfaces/AlgorithmSettings";

import { Target } from "lucide-react";

import SettingsSection from "./components/SettingsSection";
import InfoCard from "@/app/components/InfoCard/InfoCard";
import SliderInput from "@/app/components/SliderInput/SliderInput";

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
            
            <div className="settings-group">
              <SliderInput
                label="Preference Weight"
                value={settings.preferenceWeight}
                onChange={(value) => updateSetting('preferenceWeight', value)}
                description="Weight for matching student preferences"
              />
              <SliderInput
                label="Balance Weight"
                value={settings.balanceWeight}
                onChange={(value) => updateSetting('balanceWeight', value)}
                description="Weight for maintaining balanced group sizes"
              />
              <SliderInput
                label="Fairness Weight"
                value={settings.fairnessWeight}
                onChange={(value) => updateSetting('fairnessWeight', value)}
                description="Weight for balancing satisfaction across all students"
              />
              <SliderInput
                label="Compact Weight"
                value={settings.compactWeight}
                onChange={(value) => updateSetting('compactWeight', value)}
                description="Weight for reducing empty slots between classes"
              />
            </div>
            
            <div className={`p-3 rounded-lg settings-bg-tertiary`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium text-secondary`}>
                  Total Weight:
                </span>
                <span className={`text-sm font-bold ${
                  Math.abs((settings.preferenceWeight + settings.balanceWeight + settings.fairnessWeight + settings.compactWeight) - 1.0) < 0.01
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {(settings.preferenceWeight + settings.balanceWeight + settings.fairnessWeight + settings.compactWeight).toFixed(2)}
                </span>
              </div>
            </div>
          </SettingsSection>
    );
}

export default FitnessFunctionSettingsSection;