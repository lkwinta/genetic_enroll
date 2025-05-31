import React from "react";

import { LessonsState } from "../interfaces/Lesson";
import LessonCell from "./TimetableLessonCell";

import { DAYS, TIME_SLOTS } from "./TimetableConsts";

import "@/app/styles/timetable.css";

interface TimetableGridProps {
  lessons: LessonsState;
  setLessons: React.Dispatch<React.SetStateAction<LessonsState>>;
}

const TimetableGrid: React.FC<TimetableGridProps> = ({lessons, setLessons}) => {
  return (
    <div className="timetable-grid">
      <div className="grid grid-cols-6 gap-0">
        {/* Header */}
        <div className="timetable-grid-header">
          Time
        </div>
        {DAYS.map((day) => (
          <div
            key={day}
            className="timetable-grid-header"
          >
            {day}
          </div>
        ))}

        {/* Time slots and lessons */}
        {TIME_SLOTS.map((timeSlot) => (
          <React.Fragment key={timeSlot}>
            <div className="timetable-grid-slots">
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