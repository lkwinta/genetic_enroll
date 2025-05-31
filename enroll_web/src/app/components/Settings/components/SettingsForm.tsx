import React from 'react';

import '../styles/settings.css';

interface SettingsFormProps {
    name: string,
    value: string,
    onChange: (value: string) => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ name }) => {
    return (
        <div className="flex items-center mb-6">
            <div className="w-1/3">
                <label className="block">{name}</label>
            </div>
            <div className="w-2/3">
                <input
                    type="text"
                    placeholder="Enter your name"
                    onChange={(e) => console.log(e.target.value)}
                    className="block w-full"
                />
            </div>

        </div>

    )
}

export default SettingsForm;