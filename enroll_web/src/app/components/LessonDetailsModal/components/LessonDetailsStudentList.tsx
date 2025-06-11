import React from 'react';

export interface LessonDetailsStudentListProps {
    studentsInLesson: string[];
    lessonPreferences: Map<string, number>;
}

const LessonDetailsStudentList: React.FC<LessonDetailsStudentListProps> = ( { studentsInLesson, lessonPreferences } ) => {
    const headerStyle = "border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-gray-900 dark:text-white font-medium";
    const cellStyle = "border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white";

    if (!studentsInLesson || studentsInLesson.length === 0) {
        return (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">No students assigned</p>
        )
    }

    return (
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
            <div className="max-h-128 overflow-y-auto">
                <table className="w-full border-separate border-spacing-0">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className={headerStyle}>#</th>
                            <th className={headerStyle}>Student Name</th>
                            <th className={headerStyle}>Preference</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800">
                        {studentsInLesson.map((student, index) => (
                            <tr key={index} className="hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className={cellStyle}>{index + 1}</td>
                                <td className={cellStyle}>{student}</td>
                                <td className={cellStyle}>{lessonPreferences.get(student)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default LessonDetailsStudentList;