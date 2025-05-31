import React from 'react';

import '../styles/settings.css';

const NumberInput: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  enabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  description?: string;
}> = ({ label, value, onChange, enabled=true, min = 0, max = 1000, step = 1, description }) => (
  <div className="space-y-2">
    <label className="*:block text-sm font-medium settings-text-primary">
      {label}
    </label>
    <input
      type="number"
      disabled={!enabled}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors settings-input"
    />
    {description && (
      <p className={`text-xs settings-text-muted`}>{description}</p>
    )}
  </div>
);

export default NumberInput;