import React, { Dispatch, SetStateAction, FC } from 'react';
import { PerformanceSettingsState, updateSettingFactory } from './interfaces/AlgorithmSettings';
import SettingsSection from './components/SettingsSection';
import { BarChart3 } from 'lucide-react';
import ToggleSwitch from './components/SettingsToggleSwitch';
import SliderInput from './components/SettingsSliderInput';

interface PerformanceSettingsProps {
  settings: PerformanceSettingsState;
  setSettings: Dispatch<SetStateAction<PerformanceSettingsState>>;
}

const PerformanceSettingsSection: FC<PerformanceSettingsProps> = ({ settings, setSettings }) => {
    const updateSetting = updateSettingFactory<PerformanceSettingsState>(setSettings);

    return (
        <SettingsSection
            title="Advanced Features"
            icon={<BarChart3 className="text-purple-600" size={20} />}
            defaultExpanded={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleSwitch
                label="Parallel Processing"
                checked={settings.enableParallelProcessing}
                onChange={(value) => updateSetting('enableParallelProcessing', value)}
                description="Enable multi-threaded evaluation for faster computation"
              />
              {settings.enableParallelProcessing && 
                <SliderInput
                    label="Thread Count"
                    value={settings.threadCount}
                    onChange={(value) => updateSetting('threadCount', value)}
                    min={1}
                    max={16}
                    step={1}
                    description="Number of threads to use for parallel processing"
                />
              }
            </div>
          </SettingsSection>
    );
}

export default PerformanceSettingsSection;