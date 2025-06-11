'use client';

import React, { useContext, useState } from "react";
import { NextPage } from "next";
import Timetable from "@/app/components/Timetable/Timetable";
import { DataContext } from "@/app/utils/ContextManager";
import { parseIndividualIntoStudentsMap, parseScheduleIntoLessons } from "@/app/utils/TimetableParser";
import { Lesson } from "@/app/components/Timetable/interfaces/Lesson";
import LessonDetailsModal from "@/app/components/LessonDetailsModal/LessonDetailsModal";
import ErrorBanner from "@/app/components/Error/ErrorBanner";


const TimetablePage: NextPage = () => {
    const { schedule, individual, preferences } = useContext(DataContext);
    const [ selectedLesson, setSelectedLesson ] = useState<Lesson | undefined>(undefined);

    if (!schedule || !individual || !preferences) {
        return (
            <ErrorBanner
                error="Schedule, individual data or preferences are not available. Please ensure you have fetched the necessary data."
            />
        );
    }

    const { lessons, subjectColorMap } = parseScheduleIntoLessons(schedule);
    const studentOnLessons = parseIndividualIntoStudentsMap(individual.individual);

    return (
        <div className="relative">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Individual Timetable
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">(fitness: {individual.fitness})</span>
            </h1>
            <Timetable
                lessons={lessons}
                coloringFunction={(lesson) => subjectColorMap[lesson.subject] || 'teal'}
                clickable={true}
                onClick={setSelectedLesson}
            />
            <LessonDetailsModal
                studentOnLessons={studentOnLessons}
                selectedLesson={selectedLesson}
                setSelectedLesson={setSelectedLesson}
            />
        </div>
    );
}

export default TimetablePage;
