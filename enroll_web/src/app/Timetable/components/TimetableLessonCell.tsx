import React from 'react';

import {Lesson, LessonsState} from '../interfaces/Lesson';
import EditingCell from '../interfaces/EditingCell';

import EditingForm from './TimetableEditingForm';
import LessonCard from './TimetableLessonCard';

import ActionButton from './TimetableActionButton';
import { Plus } from 'lucide-react';

import { COLOR_CLASSES } from './TimetableConsts';

export const getLessonKey = (day: string, timeSlot: string): string => `${day}-${timeSlot}`;
export const getColorClass = (index: number): string => COLOR_CLASSES[index % COLOR_CLASSES.length];

const LessonCell: React.FC<{
  day: string;
  timeSlot: string;
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
  day,
  timeSlot,
  lessons,
  editingCell,
  lessonForm,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onInputChange,
  onSave,
  onCancel
}) => {
  const lessonKey = getLessonKey(day, timeSlot);
  const lessonList = lessons[lessonKey] || [];
  const isEditing = editingCell?.day === day && editingCell?.timeSlot === timeSlot;

  if (isEditing) {
    return (
      <EditingForm
        lessonForm={lessonForm}
        onInputChange={onInputChange}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  }

  return (
    <div className="p-1 min-h-32 space-y-1">
      {lessonList.map((lesson, index) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          colorClass={getColorClass(index)}
          onEdit={() => onEditLesson(day, timeSlot, lesson.id)}
          onDelete={() => onDeleteLesson(day, timeSlot, lesson.id)}
        />
      ))}
      
      <div className="flex items-center justify-center min-h-8">
        <ActionButton onClick={() => onAddLesson(day, timeSlot)} variant="add">
          <Plus size={12} />
          Add Class
        </ActionButton>
      </div>
    </div>
  );
};

export default LessonCell;