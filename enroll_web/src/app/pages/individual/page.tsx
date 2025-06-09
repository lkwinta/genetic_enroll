'use client';

import React, { useContext } from "react";
import { NextPage } from "next";
import Timetable from "@/app/components/Timetable/Timetable";
import { DataContext } from "@/app/utils/ContextManager";
import { parseIndividualIntoStudentsMap, parseScheduleIntoLessons } from "@/app/utils/TimetableParser";

const TimetablePage: NextPage = () => {
    const { schedule, individual } = useContext(DataContext);

    if (!schedule || !individual) {
        return (
            <div className="p-6 max-w-8xl mx-auto">
                <h1 className="text-2xl font-bold">No schedule or individual file uploaded</h1>
                <p>Please upload a schedule file to view the timetable.</p>
            </div>
        );
    }

    console.log("Individual:", individual);
    const { lessons, subjectColorMap } = parseScheduleIntoLessons(schedule);
    const studentOnLessons = parseIndividualIntoStudentsMap(individual.individual);

    return (
        <Timetable
            lessons={lessons}
            header={`Individual Inspect, fitness: ${individual.fitness}`}
            coloringFunction={(lesson) => subjectColorMap[lesson.subject] || 'teal'}
            clickable={true}
            onClick={(lesson) => {
                const id = `${lesson.subject}-${lesson.group_id}`;
                const students = studentOnLessons[id];

                console.log(students);
            }
            }
        />
    );
}

export default TimetablePage;
