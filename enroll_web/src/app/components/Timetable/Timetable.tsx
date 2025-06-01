'use client';

import React, { useState } from 'react';


import { LessonsState } from './interfaces/Lesson';

import TimetableHeader from './components/TimetableHeader';
import TimetableGrid from './components/TimetableGrid';
import CsvDropdown from './components/CsvDropdown';

import "./styles/timetable.css";

// Main Component
const Timetable: React.FC = () => {
  const [lessons, setLessons] = useState<LessonsState>({});
  
  const getTotalLessons = (): number => {
    return Object.values(lessons).reduce((total, lessonList) => total + lessonList.length, 0);
  };

  return (
    <div className='timetable-root'>
      <div className="flex gap-8 items-start">
        <div className="min-w-[240px]">
          <CsvDropdown onImport={setLessons} />
        </div>
        <div className="flex-1">
          <TimetableHeader totalLessons={getTotalLessons()} />
          <TimetableGrid
            lessons={lessons}
            setLessons={setLessons}
          />
        </div>

      </div>
    </div>
  );
};

export default Timetable;