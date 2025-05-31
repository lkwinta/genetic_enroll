import React from "react";

import { LessonsState } from "../interfaces/Lesson";
import LessonCell from "./TimetableLessonCell";

import { DAYS, TIME_SLOTS } from "./TimetableConsts";


interface TimetableGridProps {
  lessons: LessonsState;
  setLessons: React.Dispatch<React.SetStateAction<LessonsState>>;
}

const TimetableGrid: React.FC<TimetableGridProps> = ({lessons, setLessons}) => {
  return (
    <div className="rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800">
      <div className="grid grid-cols-6 gap-0">
        {/* Header */}
        <div className="p-4 font-semibold border-b bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
          Time
        </div>
        {DAYS.map((day) => (
          <div
            key={day}
            className="p-4 font-semibold border-b text-center bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          >
            {day}
          </div>
        ))}

        {/* Time slots and lessons */}
        {TIME_SLOTS.map((timeSlot) => (
          <React.Fragment key={timeSlot}>
            <div className="p-4 font-medium text-sm flex items-start border-r bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
              {timeSlot}
            </div>
            {DAYS.map((day) => (
              <div
                key={`${day}-${timeSlot}`}
                className="border-r border-b border-gray-200 dark:border-gray-600"
              >
                <LessonCell
                  day={day}
                  timeSlot={timeSlot}
                  lessons={lessons}
                  setLessons={setLessons}
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
};

export default TimetableGrid;