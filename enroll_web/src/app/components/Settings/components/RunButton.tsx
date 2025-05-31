import React from 'react';

import '../styles/settings.css';

const RunButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-full"
        >
            Run
        </button>
    );
}

export default RunButton;