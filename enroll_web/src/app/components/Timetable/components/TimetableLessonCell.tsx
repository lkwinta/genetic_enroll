import React from 'react';

import { Lesson, LessonsList } from '../interfaces/Lesson';

import LessonCard, { ColorClass } from './TimetableLessonCard';

import '../styles/timetable.css';

export const getLessonKey = (day: string, timeSlot: string): string => `${day}-${timeSlot}`;

interface LessonCellProps {
  day: string;
  timeSlot: string;
  lessons: LessonsList;
  coloringFunction?: (lesson: Lesson) => ColorClass;
  cardClickable?: boolean;
  onCardClick?: (lesson: Lesson) => void;
}

const LessonCell: React.FC<LessonCellProps> = ({
  day,
  timeSlot,
  lessons,
  cardClickable = false,
  coloringFunction,
  onCardClick,
}) => {
  const lessonKey = getLessonKey(day, timeSlot);
  const lessonList = lessons[lessonKey] || [];

  return (
    <div className="p-1 min-h-32 space-y-1">
      <div className="grid gap-1 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
        {lessonList.map((lesson) => (
          <LessonCard
            key={crypto.randomUUID()}
            lesson={lesson}
            colorClass={coloringFunction ? coloringFunction(lesson) : 'teal'}
            enabled={cardClickable}
            onClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
};

export type { LessonCellProps };
export default LessonCell;