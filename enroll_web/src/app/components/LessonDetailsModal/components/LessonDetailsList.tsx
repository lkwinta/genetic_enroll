import React from "react";
import { Lesson } from "../../Timetable/interfaces/Lesson";

export interface LessonDetailsListProps {
    selectedLesson: Lesson;
    studentsInLesson: string[];
}

const LessonDetailsList: React.FC<LessonDetailsListProps> = ( {selectedLesson, studentsInLesson} ) => {
    const lessonInfoMap: [string, string | number | undefined][] = [
        ["Subject", selectedLesson.subject],
        ["Teacher", selectedLesson.teacher],
        ["Room", selectedLesson.room],
        ["Day", selectedLesson.day],
        ["Time Slot", selectedLesson.timeSlot],
        ["Group ID", selectedLesson.group_id],
        ["Student Count", studentsInLesson.length],
    ]

    return (
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
    )
}

export default LessonDetailsList;