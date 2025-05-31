import React from 'react';

import '../styles/settings.css';


const Dropdown: React.FC<{
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    description?: string;
}> = ({ label, options, value, onChange, description }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium settings-text-primary">
            {label}
        </label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors settings-input"
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        {description && (
            <p className="text-xs settings-text-muted">{description}</p>
        )}
    </div>
);

export default Dropdown;