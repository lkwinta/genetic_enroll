'use client';

import React, { useContext } from "react";
import { NextPage } from "next";
import Timetable from "@/app/components/Timetable/Timetable";
import { DataContext } from "@/app/utils/ContextManager";
import { parseScheduleIntoLessons } from "@/app/utils/TimetableParser";

const TimetablePage: NextPage = () => {
    const { schedule } = useContext(DataContext);

    if (!schedule) {
        return (
            <div className="p-6 max-w-8xl mx-auto">
                <h1 className="text-2xl font-bold">No schedule file uploaded</h1>
                <p>Please upload a schedule file to view the timetable.</p>
            </div>
        );
    }

    const { lessons, subjectColorMap } = parseScheduleIntoLessons(schedule);

    return (
        <Timetable
            lessons={lessons}
            header="Schedule"
            coloringFunction={(lesson) => subjectColorMap[lesson.subject] || 'teal'}
        />
    );
}

export default TimetablePage;
