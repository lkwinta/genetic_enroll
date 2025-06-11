import React from "react";
import { Lesson } from "../../Timetable/interfaces/Lesson";
import { X } from "lucide-react";

export interface LessonDetailsWindowProps {
    setSelectedLesson: (lesson?: Lesson) => void;
    children: React.ReactNode;
}

const LessonDetailsWindow: React.FC<LessonDetailsWindowProps> = ({ setSelectedLesson, children }) => {
    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 w-200 max-w-4xl mx-4 max-h-[80vh] min-h-150 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="p-4 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between rounded-t-lg">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">Lesson Details</h3>
                <button
                    onClick={() => setSelectedLesson(undefined)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    aria-label="Close"
                >
                    <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
            </div>
            {children}
        </div>
    )
}

export default LessonDetailsWindow;