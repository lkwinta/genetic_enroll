import React, { FC } from 'react';

import '../styles/settings.css';

interface DropdownProps {
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    description?: string;
}

const Dropdown: FC<DropdownProps> = ({ label, options, value, onChange, description }) => (
    <div className="space-y-2">
        <label className="settings-dropdown text-primary">
            {label}
        </label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="settings-dropdown settings-input"
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        {description && (
            <p className="text-xs text-muted">{description}</p>
        )}
    </div>
);

export type { DropdownProps };
export default Dropdown;