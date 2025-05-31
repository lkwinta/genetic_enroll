import React, { useState } from 'react';

import { Lesson, LessonsState } from '../interfaces/Lesson';
import EditingCell from '../interfaces/EditingCell';

import EditingForm from './TimetableEditingForm';
import LessonCard from './TimetableLessonCard';

import ActionButton from './TimetableActionButton';
import { Plus } from 'lucide-react';

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

  const handleAddLesson = (day: string, timeSlot: string): void => {
    setEditingCell({ day, timeSlot });
    setLessonForm({ subject: '', teacher: '', room: '', notes: '' });
  };

  const handleSaveLesson = (): void => {
    if (!lessonForm.subject.trim() || !editingCell) return;

    const lessonKey = getLessonKey(editingCell.day, editingCell.timeSlot);

    if (editingCell.lessonId) {
      setLessons(prev => ({
        ...prev,
        [lessonKey]: (prev[lessonKey] || []).map(lesson =>
          lesson.id === editingCell.lessonId
            ? { ...lesson, ...lessonForm }
            : lesson
        )
      }));
    } else {
      const newLesson: Lesson = {
        id: generateLessonId(),
        ...lessonForm
      };

      setLessons(prev => ({
        ...prev,
        [lessonKey]: [...(prev[lessonKey] || []), newLesson]
      }));
    }

    setEditingCell(null);
    setLessonForm({ subject: '', teacher: '', room: '', notes: '' });
  };

  const handleDeleteLesson = (day: string, timeSlot: string, lessonId: string): void => {
    const lessonKey = getLessonKey(day, timeSlot);
    setLessons(prev => ({
      ...prev,
      [lessonKey]: (prev[lessonKey] || []).filter(lesson => lesson.id !== lessonId)
    }));
  };

  const handleCancelEdit = (): void => {
    setEditingCell(null);
    setLessonForm({ subject: '', teacher: '', room: '', notes: '' });
  };

  const handleInputChange = (field: keyof Omit<Lesson, 'id'>, value: string): void => {
    setLessonForm(prev => ({ ...prev, [field]: value }));
  };


  if (isEditing) {
    return (
      <EditingForm 
        lessonForm={lessonForm}
        onInputChange={handleInputChange}
        onSave={handleSaveLesson}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="p-1 min-h-32 space-y-1">
      {lessonList.map((lesson, index) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          index={index}
          onEdit={() => handleEditLesson(day, timeSlot, lesson.id)}
          onDelete={() => handleDeleteLesson(day, timeSlot, lesson.id)}
        />
      ))}

      <div className="flex items-center justify-center min-h-8">
        <ActionButton onClick={() => handleAddLesson(day, timeSlot)} variant="add">
          <Plus size={12} />
          Add Class
        </ActionButton>
      </div>
    </div>
  );
};

export type { LessonCellProps };
export default LessonCell;