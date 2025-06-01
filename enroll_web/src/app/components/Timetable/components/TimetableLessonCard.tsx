import React from 'react';

import {Lesson} from '../interfaces/Lesson'

import '../styles/timetable.css';

interface LessonCardProps {
  lesson: Lesson;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

const colorClasses: string[] = [
  'purple', 'blue', 'green', 'yellow', 'orange', 'red', 'pink', 'teal'
]

const LessonCard: React.FC<LessonCardProps> = ({ lesson, index, onEdit, onDelete }) => (
  <button disabled={true} className={`${colorClasses[index % colorClasses.length]} timetable-lesson-card`}>
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

export type { LessonCardProps };
export default LessonCard;
