import React from 'react';

import { Lesson } from '../interfaces/Lesson'

import '../styles/timetable.css';

type ColorClass = 'purple' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'pink' | 'teal';


interface LessonCardProps {
  lesson: Lesson;

  enabled?: boolean;
  colorClass?: ColorClass;

  onClick?: (lesson: Lesson) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, colorClass = 'teal', enabled = false, onClick }) => (
  <button disabled={!enabled} className={`${colorClass} timetable-lesson-card`}
    onClick={() => {
      if (onClick)
        onClick(lesson);
    }}
  >
    <div className="font-semibold">{lesson.subject}</div>
    {lesson.teacher && <div className="teacher">👨‍🏫 {lesson.teacher}</div>}
    {lesson.room && <div className="room">🏠 {lesson.room}</div>}
    {lesson.notes && (
      <div className="notes" title={lesson.notes}>
        📝 {lesson.notes}
      </div>
    )}
  </button>
);

export type { LessonCardProps, ColorClass };
export default LessonCard;
