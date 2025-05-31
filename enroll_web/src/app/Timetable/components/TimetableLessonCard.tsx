import React from 'react';

import {Lesson} from '../interfaces/Lesson';

import ActionButton from "./TimetableActionButton";
import { Edit, Trash2 } from "lucide-react";

const LessonCard: React.FC<{
  lesson: Lesson;
  colorClass: string;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ lesson, colorClass, onEdit, onDelete }) => (
  <div className={`p-2 border rounded text-xs group relative ${colorClass}`}>
    <div className="font-semibold">{lesson.subject}</div>
    {lesson.teacher && <div className="text-gray-600 dark:text-gray-300">👨‍🏫 {lesson.teacher}</div>}
    {lesson.room && <div className="text-gray-600 dark:text-gray-300">🏠 {lesson.room}</div>}
    {lesson.notes && (
      <div className="mt-1 truncate text-gray-500 dark:text-gray-400" title={lesson.notes}>
        📝 {lesson.notes}
      </div>
    )}
    
    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
      <ActionButton onClick={onEdit} variant="edit">
        <Edit size={8} />
      </ActionButton>
      <ActionButton onClick={onDelete} variant="delete">
        <Trash2 size={8} />
      </ActionButton>
    </div>
  </div>
);

export default LessonCard;
