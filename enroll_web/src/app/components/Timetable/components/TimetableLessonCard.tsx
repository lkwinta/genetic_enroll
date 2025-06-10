import React from 'react';

import { Lesson } from '../interfaces/Lesson'

import '../styles/timetable.css';

type ColorClass = 'purple' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'pink' | 'teal';


interface LessonCardProps {
    lesson: Lesson;

    enabled?: boolean;
    colorClass?: ColorClass;

    onClick?: (lesson: Lesson) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, colorClass = 'teal', enabled = false, onClick }) => {
    const showPoints = lesson.pointsAssigned && lesson.pointsPerCapacity;
    return (
        <button disabled={!enabled} className={`${colorClass} timetable-lesson-card`}
            onClick={() => {
                if (onClick)
                    onClick(lesson);
            }}
        >
            <div className="font-semibold">{lesson.subject}</div>
            {lesson.teacher && <div className="teacher"> {lesson.teacher}</div>}
            {lesson.room && <div className="room">🏠 {lesson.room}</div>}
            {lesson.notes && (
                <div className="notes" title={lesson.notes}>
                    📝 {lesson.notes}
                </div>
            )}
            {!!showPoints &&
                (<div className="flex justify-between items-center">
                    <div className='points'>{lesson.pointsAssigned}</div>
                    <div className='points-capacity'>{lesson.pointsPerCapacity!.toFixed(2)}</div>
                </div>) 
            }
            {lesson.preference && <div className="preference"> {lesson.preference}</div>}
        </button>
    )
};

export type { LessonCardProps, ColorClass };
export default LessonCard;
