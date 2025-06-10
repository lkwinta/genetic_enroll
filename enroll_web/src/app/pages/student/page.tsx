'use client';

import React, { useContext } from "react";
import { NextPage } from "next";
import Timetable from "@/app/components/Timetable/Timetable";
import { parseIndividualIntoStudentsAssignments, parseScheduleIntoLessons } from "@/app/utils/TimetableParser";
import { DataContext } from "@/app/utils/ContextManager";
import { Lesson } from "@/app/components/Timetable/interfaces/Lesson";

const StudentPage: NextPage = () => {
    const { preferences, schedule, individual, selectedStudent } = useContext(DataContext);

    if (!preferences || !schedule || !individual || !selectedStudent) {
        return (
            <div className="p-6 max-w-8xl mx-auto">
                <h1 className="text-2xl font-bold">No preferences file uploaded</h1>
                <p>Please upload a preference file to view the timetable.</p>
            </div>
        );
    }

    const studentAssignments = parseIndividualIntoStudentsAssignments(individual.individual, selectedStudent);
    const { lessons } = parseScheduleIntoLessons(schedule);

    const filter = (lessonList: Lesson[]) => {
        return lessonList.filter(lesson => 
            studentAssignments.some(([as_subject, as_groupId]) => as_subject === lesson.subject && as_groupId === lesson.group_id)
        );
    }

    const lessonsFiltered = Object.fromEntries(
        Object.entries(lessons).map(([day, lessonList]) => [
            day,
            filter(lessonList)
        ])
    );

    console.log("Filtered lessons for student:", selectedStudent, lessonsFiltered, studentAssignments);

    return (
        <Timetable
            lessons={lessonsFiltered}
            header={`${selectedStudent}'s plan`}
            coloringFunction={() => 'teal'}
        />
    );
}

export default StudentPage;