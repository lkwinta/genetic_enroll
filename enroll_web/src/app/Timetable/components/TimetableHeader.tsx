import React from 'react';
import { Clock } from 'lucide-react';

const TimetableHeader: React.FC<{
  totalLessons: number;
}> = ({ totalLessons }) => (
  <div className="flex items-center justify-between mb-6">
    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Weekly Timetable</h1>
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
      <Clock size={16} />
      <span>{totalLessons} total classes scheduled</span>
    </div>
  </div>
);

export default TimetableHeader;