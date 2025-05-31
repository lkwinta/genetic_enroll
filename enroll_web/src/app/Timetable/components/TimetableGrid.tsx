import React from "react";

import {Lesson, LessonsState} from "../interfaces/Lesson";
import EditingCell from "../interfaces/EditingCell";
import LessonCell from "./TimetableLessonCell";

import {DAYS, TIME_SLOTS} from "./TimetableConsts";

const TimetableGrid: React.FC<{
  lessons: LessonsState;
  editingCell: EditingCell | null;
  lessonForm: Omit<Lesson, 'id'>;
  onAddLesson: (day: string, timeSlot: string) => void;
  onEditLesson: (day: string, timeSlot: string, lessonId: string) => void;
  onDeleteLesson: (day: string, timeSlot: string, lessonId: string) => void;
  onInputChange: (field: keyof Omit<Lesson, 'id'>, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}> = ({
  lessons,
  editingCell,
  lessonForm,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onInputChange,
  onSave,
  onCancel
}) => (
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
                editingCell={editingCell}
                lessonForm={lessonForm}
                onAddLesson={onAddLesson}
                onEditLesson={onEditLesson}
                onDeleteLesson={onDeleteLesson}
                onInputChange={onInputChange}
                onSave={onSave}
                onCancel={onCancel}
              />
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  </div>
);

export default TimetableGrid;