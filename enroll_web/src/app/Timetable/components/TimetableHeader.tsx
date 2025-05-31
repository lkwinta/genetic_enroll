import React from 'react';
import { Clock } from 'lucide-react';

import '@/app/styles/timetable.css';

const TimetableHeader: React.FC<{
  totalLessons: number;
}> = ({ totalLessons }) => (
  <div className="timetable-header">
    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Weekly Timetable</h1>
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
      <Clock size={16} />
      <span>{totalLessons} total classes scheduled</span>
    </div>
  </div>
);

export default TimetableHeader;