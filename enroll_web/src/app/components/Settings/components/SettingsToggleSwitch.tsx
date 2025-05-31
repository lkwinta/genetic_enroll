import React from 'react';

import '../styles/settings.css';


const ToggleSwitch: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}> = ({ label, checked, onChange, description }) => (
  <div className="settings-toggle-switch">
    <div className="flex-1">
      <label>
        {label}
      </label>
      {description && (
        <p>{description}</p>
      )}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`${checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
    >
      <span
        className={`${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  </div>
);

export default ToggleSwitch;