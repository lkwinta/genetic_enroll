'use client';

import React, { useContext } from "react";
import { NextPage } from "next";
import Timetable from "@/app/components/Timetable/Timetable";
import { parseScheduleIntoLessons, parseStudentsPreferences } from "@/app/utils/TimetableParser";
import { DataContext } from "@/app/utils/ContextManager";
import ErrorBanner from "@/app/components/Error/ErrorBanner";

const TimetablePage: NextPage = () => {
    const { schedule, preferences } = useContext(DataContext);

    if (!schedule || !preferences) {
        return (
            <ErrorBanner
                error="Schedule or preferences data is not available. Please ensure you have fetched the schedule and preferences."
            />
        );
    }

    const { lessons, subjectColorMap } = parseScheduleIntoLessons(schedule);
    const preferencesMap = parseStudentsPreferences(preferences);

    const lessonsWithPreferences = Object.fromEntries(
        Object.entries(lessons).map(([timeSlot, lessonList]) =>
            [
                timeSlot,
                lessonList.map(lesson => {
                    const lesson_id = `${lesson.subject}-${lesson.group_id}`
                    const pointsAssigned = preferencesMap[lesson_id][0] || 0;
                    const maxCount = preferencesMap[lesson_id][2] || 0;
                    return {
                        ...lesson,
                        pointsAssigned: pointsAssigned,
                        pointsPerCapacity: (maxCount / (lesson.capacity || 1)),
                    };
                })
            ]
        )
    );

    return (
        <Timetable
            lessons={lessonsWithPreferences}
            header="Preferences"
            coloringFunction={(lesson) => {
                return subjectColorMap[lesson.subject] || 'teal';
            }}
        />
    );
}

export default TimetablePage;
