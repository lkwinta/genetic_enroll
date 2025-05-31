'use client';

import React, { useState } from 'react';


import { LessonsState } from './interfaces/Lesson';

import TimetableHeader from './components/TimetableHeader';
import TimetableGrid from './components/TimetableGrid';

import "@/app/styles/timetable.css";

// Main Component
const Timetable: React.FC = () => {
  const [lessons, setLessons] = useState<LessonsState>({});
  
  const getTotalLessons = (): number => {
    return Object.values(lessons).reduce((total, lessonList) => total + lessonList.length, 0);
  };

  return (
    <div className='timetable-root'>
      <div className="p-6 max-w-7xl mx-auto">
        <TimetableHeader totalLessons={getTotalLessons()} />
        
        <TimetableGrid 
          lessons={lessons}
          setLessons={setLessons}
        />
      </div>
    </div>
  );
};

export default Timetable;