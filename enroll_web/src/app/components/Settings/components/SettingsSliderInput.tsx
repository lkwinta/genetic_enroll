import React, { FC, CSSProperties } from 'react';

import '../styles/settings.css';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  description?: string;
}

const SliderInput: FC<SliderInputProps> = ({ label, value, onChange, min = 0, max = 1, step = 0.01, description }) => (
  <div className="space-y-2">
    <div className="settings-slider-label">
      <label className="settings-slider-label setting-text-primary">
        {label}
      </label>
      <span className="settings-slider-label settings-text-secondary">
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
      className="settings-slider-fill settings-slider-input"
      style={{
        "--percentage": `${((value - min) / (max - min)) * 100}%`,
      } as CSSProperties}
    />
    {description && (
      <p className="text-xs settings-text-muted">{description}</p>
    )}
  </div>
);

export type { SliderInputProps };
export default SliderInput;