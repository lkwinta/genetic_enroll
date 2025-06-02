'use client';

import React, { useContext } from "react";
import { NextPage } from "next";
import Timetable from "@/app/components/Timetable/Timetable";
import { FilesContext } from "@/app/global_state";
import { parseIndividualIntoStudentsMap, parseScheduleIntoLessons } from "@/app/utils/TimetableParser";

const TimetablePage: NextPage = () => {
    const { scheduleFile, individualFile } = useContext(FilesContext);

    if (!scheduleFile || !individualFile) {
        return (
            <div className="p-6 max-w-8xl mx-auto">
                <h1 className="text-2xl font-bold">No schedule file uploaded</h1>
                <p>Please upload a schedule file to view the timetable.</p>
            </div>
        );
    }

    const { lessons, subjectColorMap } = parseScheduleIntoLessons(scheduleFile);
    const studentOnLessons = parseIndividualIntoStudentsMap(individualFile);
    console.log(studentOnLessons);
    return (
        <Timetable
            lessons={lessons}
            header="Individual Inspect"
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
