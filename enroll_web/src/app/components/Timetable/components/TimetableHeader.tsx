import React from 'react';
import { Clock } from 'lucide-react';

import '../styles/timetable.css';

const TimetableHeader: React.FC<{
  header?: string;
  totalLessons: number;
}> = ({ header, totalLessons }) => (
  <div className="timetable-header">
    <h1>{header}</h1>
    <div>
      <Clock size={16} />
      <span>{totalLessons} total classes scheduled</span>
    </div>
  </div>
);

export default TimetableHeader;