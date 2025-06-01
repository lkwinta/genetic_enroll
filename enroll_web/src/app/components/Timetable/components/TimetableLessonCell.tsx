import React, { useState } from 'react';

import { Lesson, LessonsState } from '../interfaces/Lesson';
import EditingCell from '../interfaces/EditingCell';

import LessonCard from './TimetableLessonCard';

import '../styles/timetable.css';

export const getLessonKey = (day: string, timeSlot: string): string => `${day}-${timeSlot}`;
const generateLessonId = (): string => `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

interface LessonCellProps {
  day: string;
  timeSlot: string;
  lessons: LessonsState;
  setLessons: React.Dispatch<React.SetStateAction<LessonsState>>;
}

const LessonCell: React.FC<LessonCellProps> = ({
  day,
  timeSlot,
  lessons,
  setLessons,
}) => {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [lessonForm, setLessonForm] = useState<Omit<Lesson, 'id'>>({
    subject: '',
    teacher: '',
    room: '',
    notes: ''
  });


  const lessonKey = getLessonKey(day, timeSlot);
  const lessonList = lessons[lessonKey] || [];
  const isEditing = editingCell?.day === day && editingCell?.timeSlot === timeSlot;

  const handleEditLesson = (day: string, timeSlot: string, lessonId: string): void => {
    const lessonKey = getLessonKey(day, timeSlot);
    const lessonList = lessons[lessonKey] || [];
    const lesson = lessonList.find(l => l.id === lessonId);

    if (lesson) {
      setEditingCell({ day, timeSlot, lessonId });
      setLessonForm({
        subject: lesson.subject,
        teacher: lesson.teacher,
        room: lesson.room,
        notes: lesson.notes
      });
    }
  };

  const handleDeleteLesson = (day: string, timeSlot: string, lessonId: string): void => {
    const lessonKey = getLessonKey(day, timeSlot);
    setLessons(prev => ({
      ...prev,
      [lessonKey]: (prev[lessonKey] || []).filter(lesson => lesson.id !== lessonId)
    }));
  };

  return (
    <div className="p-1 min-h-32 space-y-1">
      <div className="grid gap-1 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
        {lessonList.map((lesson, index) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            index={index}
            onEdit={() => handleEditLesson(day, timeSlot, lesson.id)}
            onDelete={() => handleDeleteLesson(day, timeSlot, lesson.id)}
          />
        ))}
      </div>
    </div>
  );
};

export type { LessonCellProps };
export default LessonCell;