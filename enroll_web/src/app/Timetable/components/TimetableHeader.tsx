import React from 'react';
import { Clock } from 'lucide-react';

import '@/app/styles/timetable.css';

const TimetableHeader: React.FC<{
  totalLessons: number;
}> = ({ totalLessons }) => (
  <div className="timetable-header">
    <h1>Weekly Timetable</h1>
    <div>
      <Clock size={16} />
      <span>{totalLessons} total classes scheduled</span>
    </div>
  </div>
);

export default TimetableHeader;