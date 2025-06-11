'use client';

import React, { useContext } from "react";
import { NextPage } from "next";
import Timetable from "@/app/components/Timetable/Timetable";
import { DataContext } from "@/app/utils/ContextManager";
import { parseScheduleIntoLessons } from "@/app/utils/TimetableParser";
import ErrorBanner from "@/app/components/Error/ErrorBanner";

const TimetablePage: NextPage = () => {
    const { schedule } = useContext(DataContext);

    if (!schedule) {
        return (
            <ErrorBanner error="Schedule data is not available. Please ensure you have fetched the schedule." />
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
