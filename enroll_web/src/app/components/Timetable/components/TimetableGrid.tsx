import React, {Fragment, Dispatch, SetStateAction, FC} from "react";

import { Lesson, LessonsList } from "../interfaces/Lesson";
import LessonCell from "./TimetableLessonCell";

import { DAYS, TIME_SLOTS } from "./TimetableConsts";

import '../styles/timetable.css';
import { ColorClass } from "./TimetableLessonCard";

interface TimetableGridProps {
  lessons: LessonsList;
  coloringFunction?: (lesson: Lesson) => ColorClass;
  lessonsClickable?: boolean;
  onLessonClick?: (lesson: Lesson) => void;
}

const TimetableGrid: FC<TimetableGridProps> = ({lessons, lessonsClickable, coloringFunction, onLessonClick}) => {
  return (
    <div className="timetable-grid">
      <div
        className="grid gap-0 grid-cols-[minmax(1rem,_auto)_repeat(5,_1fr)]"
      >
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
          <Fragment key={timeSlot}>
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
                  coloringFunction={coloringFunction}
                  cardClickable={lessonsClickable}
                  onCardClick={onLessonClick}
                />
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
};

export default TimetableGrid;