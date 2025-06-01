'use client';

import React, { useState } from 'react';


import { Lesson, LessonsState } from './interfaces/Lesson';

import TimetableHeader from './components/TimetableHeader';
import TimetableGrid from './components/TimetableGrid';

import { TIME_SLOTS, DAYS } from './components/TimetableConsts';

import "./styles/timetable.css";
import { FileObject } from '../FileUpload/interfaces/File';

const DAY_MAP: Record<string, string> = {
  Pn: 'Monday',
  Wt: 'Tuesday',
  Sr: 'Wednesday',
  Cz: 'Thursday',
  Pt: 'Friday',
  Sb: 'Saturday',
  Nd: 'Sunday',
};

interface TimetableProps {
    type?: 'schedule' | 'preferences';
    file?: FileObject;
}

const normalizeHour = (timeStr: string): string => {
    const [hh, mm] = timeStr.split(":");
    return `${parseInt(hh, 10)}:${mm}`;
};

const findSlot = (start: string): string | null => {
    const normalized = normalizeHour(start);
    return TIME_SLOTS.find(slot => slot.startsWith(normalized)) ?? null;
};

const parseCSVIntoLessons = (file?: FileObject) => {
    if (!file || file.status !== 'success') return {};

    const newLessons: LessonsState = {};

    file!.data!.forEach((row, idx) => {
        const dayKey = DAY_MAP[row.day];
        if (!dayKey || !DAYS.includes(dayKey)) {
            console.warn(`❌ Nieznany dzień w wierszu ${idx + 1}:`, row.day);
            return {};
        }
        const slot = findSlot(row.start_time);
        if (!slot) {
            console.warn(
                `❌ Nieznany slot dla '${row.start_time}' (wiersz ${idx + 1})`
            );
            return {};
        }

        const key = `${dayKey}-${slot}`;

        const lesson: Lesson = {
            id: crypto.randomUUID(),
            subject: row.subject,
            teacher: row.teacher,
            room: row.classroom,
            notes: `${row.type || ''} ${row.group_id || ''}`.trim(),
        };
        newLessons[key] = [...(newLessons[key] || []), lesson];
    });

    return newLessons;
}

const Timetable: React.FC<TimetableProps> = ({ type, file }) => {
    const [lessons, setLessons] = useState<LessonsState>(parseCSVIntoLessons(file));

    const getTotalLessons = (): number => {
        return Object.values(lessons).reduce((total, lessonList) => total + lessonList.length, 0);
    };

    return (
        <div className='timetable-root'>
            <div className="p-6 max-w-8xl mx-auto">
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