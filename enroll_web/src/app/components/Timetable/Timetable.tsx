'use client';

import React from 'react';

import { Lesson, LessonsList } from './interfaces/Lesson';

import TimetableHeader from './components/TimetableHeader';
import TimetableGrid from './components/TimetableGrid';

import "./styles/timetable.css";

import { ColorClass } from './components/TimetableLessonCard';

interface TimetableProps {
    header?: string;
    lessons?: LessonsList;
    clickable?: boolean;
    onClick?: (lesson: Lesson) => void;
    coloringFunction?: (lesson: Lesson) => ColorClass;
}

const Timetable: React.FC<TimetableProps> = ({ header, lessons = {}, clickable, onClick, coloringFunction }) => {
    const getTotalLessons = (): number => {
        return Object.values(lessons).reduce((total, lessonList) => total + lessonList.length, 0);
    };

    return (
        <div className="p-6 max-w-8xl mx-auto">
            <TimetableHeader header={header} totalLessons={getTotalLessons()}/>
            <TimetableGrid
                lessons={lessons}
                lessonsClickable={clickable}
                coloringFunction={coloringFunction}
                onLessonClick={onClick}
            />
        </div>
    );
};

export default Timetable;