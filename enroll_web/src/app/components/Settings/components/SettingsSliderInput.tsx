import React from 'react';

import '../styles/settings.css';

const SliderInput: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  description?: string;
}> = ({ label, value, onChange, min = 0, max = 1, step = 0.01, description }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className={`text-sm font-medium setting-text-primary`}>
        {label}
      </label>
      <span className={`text-sm settings-text-secondary font-mono`}>
        {value.toFixed(2)}
      </span>
    </div>
    <input
      type="range"
      value={value}
      onChange={(e) => {
        const value = Number(e.target.value);
        e.target.style.setProperty('--percentage', (((value - min) / (max - min)) * 100).toString() + '%');
        onChange(Number(e.target.value));
      }}
      min={min}
      max={max}
      step={step}
      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
    />
    {description && (
      <p className={`text-xs settings-text-muted`}>{description}</p>
    )}
  </div>
);

export default SliderInput;