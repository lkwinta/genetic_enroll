import React, { FC } from 'react';

import '../styles/settings.css';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  enabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  description?: string;
}

const NumberInput: FC<NumberInputProps> = ({ label, value, onChange, enabled=true, min = 0, max = 1000, step = 1, description }) => (
  <div className="space-y-2">
    <label className="settings-number-input settings-text-primary">
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
      className="settings-number-input settings-input"
    />
    {description && (
      <p className={`text-xs settings-text-muted`}>{description}</p>
    )}
  </div>
);

export type { NumberInputProps };
export default NumberInput;