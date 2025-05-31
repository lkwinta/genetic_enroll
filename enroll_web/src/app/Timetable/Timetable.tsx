'use client';

import React, { useState } from 'react';


import { Lesson, LessonsState } from './interfaces/Lesson';

import EditingCell from './interfaces/EditingCell';
import { getLessonKey } from './components/TimetableLessonCell';
import TimetableHeader from './components/TimetableHeader';
import TimetableGrid from './components/TimetableGrid';


const generateLessonId = (): string => `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Main Component
const Timetable: React.FC = () => {
  const [lessons, setLessons] = useState<LessonsState>({});
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [lessonForm, setLessonForm] = useState<Omit<Lesson, 'id'>>({
    subject: '',
    teacher: '',
    room: '',
    notes: ''
  });

  const handleAddLesson = (day: string, timeSlot: string): void => {
    setEditingCell({ day, timeSlot });
    setLessonForm({ subject: '', teacher: '', room: '', notes: '' });
  };

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

  const getTotalLessons = (): number => {
    return Object.values(lessons).reduce((total, lessonList) => total + lessonList.length, 0);
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900 dark">
      <div className="p-6 max-w-7xl mx-auto">
        <TimetableHeader totalLessons={getTotalLessons()} />
        
        <TimetableGrid
          lessons={lessons}
          editingCell={editingCell}
          lessonForm={lessonForm}
          onAddLesson={handleAddLesson}
          onEditLesson={handleEditLesson}
          onDeleteLesson={handleDeleteLesson}
          onInputChange={handleInputChange}
          onSave={handleSaveLesson}
          onCancel={handleCancelEdit}
        />
      </div>
    </div>
  );
};

export default Timetable;