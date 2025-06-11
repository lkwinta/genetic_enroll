import { useContext, useEffect, useRef } from "react";

import { X } from "lucide-react";
import { Lesson } from "../Timetable/interfaces/Lesson";
import { parsePreferencesByLesson } from "@/app/utils/TimetableParser";
import LessonDetailsPreferencesHistogram from "./components/LessonDetailsPreferencesHistogram";
import { DataContext } from "@/app/utils/ContextManager";

interface LessonDetailsModalProps {
    studentOnLessons: Record<string, string[]>;
    selectedLesson: Lesson | undefined;
    setSelectedLesson: (lesson: Lesson | undefined) => void;
}

const LessonDetailsModal: React.FC<LessonDetailsModalProps> = ({studentOnLessons, selectedLesson, setSelectedLesson}) => {
    const { preferences } = useContext(DataContext);
    const isDark = useRef<boolean>(false);
    useEffect(() => {
        isDark.current = window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    if (!selectedLesson || !preferences) return (<></>);
    
    const studentsInLesson = studentOnLessons[`${selectedLesson.subject}-${selectedLesson.group_id}`] || [];
    const lessonInfoMap: [string, string | number | undefined][] = [
        ["Subject", selectedLesson.subject],
        ["Teacher", selectedLesson.teacher],
        ["Room", selectedLesson.room],
        ["Day", selectedLesson.day],
        ["Time Slot", selectedLesson.timeSlot],
        ["Group ID", selectedLesson.group_id],
        ["Student Count", studentsInLesson.length],
    ]

    const lessonPreferences = parsePreferencesByLesson(preferences, selectedLesson);

    return (
        <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedLesson(undefined)}
        >
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
                <div className="flex h-full">
                    <div className="w-1/2 p-6  border-r border-gray-200 dark:border-gray-600 items-center">
                    <div className="space-y-4">
                        {lessonInfoMap.map(([label, value], index) => {
                            return (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-300 font-medium">{label}:</span>
                                    <span className="text-gray-800 dark:text-gray-200">{value}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="items-center h-1/4 mt-10">
                       <LessonDetailsPreferencesHistogram 
                            lessonPreferences={lessonPreferences}
                            studentsInLesson={studentsInLesson}
                            isDark={isDark.current}
                        />
                    </div>      
                    </div>
                    <div className="w-1/2 p-6">
                        {studentsInLesson.length > 0 ? (
                                <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                                    <div className="max-h-128 overflow-y-auto">
                                        <table className="w-full border-separate border-spacing-0">
                                            <thead className="sticky top-0 z-10">
                                                <tr className="bg-gray-100 dark:bg-gray-700">
                                                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-gray-900 dark:text-white font-medium">#</th>
                                                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-gray-900 dark:text-white font-medium">Student Name</th>
                                                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-gray-900 dark:text-white font-medium">Preference</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800">
                                                {studentsInLesson.map((student, index) => (
                                                    <tr key={index} className="hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors">
                                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">{index + 1}</td>
                                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">{student}</td>
                                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">{lessonPreferences.get(student)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm italic">No students assigned</p>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LessonDetailsModal;