'use client';

import React, { useContext } from "react";
import { NextPage } from "next";
import Timetable from "@/app/components/Timetable/Timetable";
import { parseScheduleIntoLessons, parseStudentsPreferences } from "@/app/utils/TimetableParser";
import { DataContext } from "@/app/utils/ContextManager";

const TimetablePage: NextPage = () => {
    const { schedule, preferences } = useContext(DataContext);

    if (!schedule || !preferences) {
        return (
            <div className="p-6 max-w-8xl mx-auto">
                <h1 className="text-2xl font-bold">No preferences file uploaded</h1>
                <p>Please upload a preference file to view the timetable.</p>
            </div>
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
