'use client';

import React, { useContext } from "react";
import { NextPage } from "next";
import Timetable from "@/app/components/Timetable/Timetable";
import { parseIndividualIntoStudentsAssignments, parseScheduleIntoLessons, parseStudentPreferences } from "@/app/utils/TimetableParser";
import { DataContext } from "@/app/utils/ContextManager";
import { Lesson, LessonsList } from "@/app/components/Timetable/interfaces/Lesson";
import ErrorBanner from "@/app/components/Error/ErrorBanner";

const StudentPage: NextPage = () => {
    const { preferences, schedule, individual, selectedStudent } = useContext(DataContext);

    if (!preferences || !schedule || !individual || !selectedStudent) {
        return (
            <ErrorBanner
                error="Preferences, schedule, individual data or selected student is not available. Please ensure you have fetched the necessary data."
            />
        );
    }

    const studentAssignments = parseIndividualIntoStudentsAssignments(individual.individual, selectedStudent);
    const { lessons } = parseScheduleIntoLessons(schedule);
    const studentPreferences = parseStudentPreferences(preferences, selectedStudent); 

    const findLessonsBySubjectAndGroup = (subject: string, group_id: number) => {
        return Object.values(lessons).flat().filter(lesson => {
            return lesson.subject === subject && lesson.group_id === group_id;
        });
    };

    console.log(studentPreferences)

    const preferencesLessons = studentPreferences.entries().filter(x => x[1] !== 0).map(([[subject, group_id], preference]) => {
        return findLessonsBySubjectAndGroup(subject, group_id).map(lesson => ({
            ...lesson,
            preference: preference
        } as Lesson));
    }).toArray().flat();

    const preferencesLessonsList: LessonsList = preferencesLessons.reduce((acc, lesson) => {
        const key = `${lesson.day}-${lesson.timeSlot}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(lesson);
        return acc;
    }, {} as LessonsList);
        
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

    // Merge preferences lessons into the filtered lessons
    Object.entries(preferencesLessonsList).forEach(([day, lessonList]) => {
        if (!lessonsFiltered[day]) {
            lessonsFiltered[day] = lessonList;
        } else {
            lessonList.forEach(preferenceLesson => {
                const existingLesson = lessonsFiltered[day].findIndex(lesson => 
                    lesson.subject === preferenceLesson.subject && lesson.group_id === preferenceLesson.group_id
                );
                if (existingLesson !== -1) {
                    lessonsFiltered[day][existingLesson].assigned = true;
                    lessonsFiltered[day][existingLesson].preference = preferenceLesson.preference;
                } else {
                    lessonsFiltered[day].push(preferenceLesson);
                }
            });
        }    
    });

    return (
        <Timetable
            lessons={lessonsFiltered}
            header={`${selectedStudent}'s plan`}
            coloringFunction={(lesson) => lesson.assigned ? 'orange' : 'teal'}
        />
    );
}

export default StudentPage;