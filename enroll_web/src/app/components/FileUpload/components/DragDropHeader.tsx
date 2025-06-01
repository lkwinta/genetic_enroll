import React, { FC } from 'react';

interface DragDropHeaderProps {
    title: string;
    viewButtonEnabled?: boolean;
    viewButtonOnClick?: () => void;
}
const DragDropHeader: FC<DragDropHeaderProps> = ({ title, viewButtonEnabled = false, viewButtonOnClick }) => {
    return (
        <div className="p-4 flex items-center justify-between bg-gray-100 dark:bg-gray-700">
            <div className="flex-1"></div>
            <div className="flex-1 text-center font-semibold bg-gray-100 text-gray-700 dark:text-gray-200 border-gray-200 dark:bg-gray-700 dark:border-gray-600 py-4">
                {title}
            </div>
            <div className="flex-1 flex justify-end">
                {viewButtonEnabled &&
                    <button
                        onClick={viewButtonOnClick}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                        type="button"
                    >
                        View
                    </button>
                }
            </div>
        </div>
    )
}

export type { DragDropHeaderProps }
export default DragDropHeader;