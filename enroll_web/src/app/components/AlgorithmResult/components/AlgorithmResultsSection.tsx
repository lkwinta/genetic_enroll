import React from 'react';

export interface AlgorithmResultsSectionProps {
    title?: string;
    viewButton?: boolean;
    viewButtonOnClick?: () => void;
    viewButtonText?: string;
        children: React.ReactNode;

}

const AlgorithmResultsSection: React.FC<AlgorithmResultsSectionProps> = ({title, viewButton=false, viewButtonText="View", viewButtonOnClick,  children}) => {

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-300 dark:border-gray-600 mb-6">
            <div className="flex py-4 pr-4 items-center justify-between">
                <h2 className="px-6 py-4 flex transition-colors rounded-t-xl text-lg font-bold text-gray-900 dark:text-white">
                    {title}
                </h2>
                 <div className="flex-1 flex justify-end">
                    {viewButton &&
                        <button
                            onClick={viewButtonOnClick}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                            type="button"
                        >
                            {viewButtonText}
                        </button>
                    }
                    </div>
            </div> 
            <div className="px-6 pb-6 pt-4 space-y-4 border-t border-gray-100 dark:border-gray-700">
                {children}
            </div>           
        </div>
    )
}

export default AlgorithmResultsSection;