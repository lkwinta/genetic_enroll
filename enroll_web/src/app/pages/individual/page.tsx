'use client';

import React, { useContext, useState } from "react";
import { NextPage } from "next";
import Timetable from "@/app/components/Timetable/Timetable";
import { CSVInput, DataContext, PreferencesRowType } from "@/app/utils/ContextManager";
import { parseIndividualIntoStudentsMap, parsePreferencesByLesson, parseScheduleIntoLessons } from "@/app/utils/TimetableParser";
import { Lesson } from "@/app/components/Timetable/interfaces/Lesson";
import { X } from "lucide-react";
import { Bar, BarChart, Label, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const TimetablePage: NextPage = () => {
    const { schedule, individual, preferences } = useContext(DataContext);
    const [ selectedLesson, setSelectedLesson ] = useState<Lesson | undefined>(undefined);

    if (!schedule || !individual || !preferences) {
        return (
            <div className="p-6 max-w-8xl mx-auto">
                <h1 className="text-2xl font-bold">No schedule or individual file uploaded</h1>
                <p>Please upload a schedule file to view the timetable.</p>
            </div>
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
                preferences={preferences}
            />
        </div>
    );
}

interface LessonDetailsModalProps {
    studentOnLessons: Record<string, string[]>;
    selectedLesson: Lesson | undefined;
    setSelectedLesson: (lesson: Lesson | undefined) => void;
    preferences: CSVInput<PreferencesRowType>;
}
const LessonDetailsModal: React.FC<LessonDetailsModalProps> = ({studentOnLessons, selectedLesson, setSelectedLesson, preferences}) => {
    if (!selectedLesson) return (<></>);

    const lessonPreferences = parsePreferencesByLesson(preferences, selectedLesson);

    const studentsInLesson = studentOnLessons[`${selectedLesson.subject}-${selectedLesson.group_id}`] || [];
    const lessonInfoMap: [string, string | number | undefined][] = [
        ["Subject", selectedLesson.subject],
        ["Teacher", selectedLesson.teacher],
        ["Room", selectedLesson.room],
        ["Day", selectedLesson.day],
        ["Time Slot", selectedLesson.timeSlot],
        ["Group ID", selectedLesson.group_id],
        ["Student Count", studentsInLesson.length],
    ]

    const preferenceHistogram = Array.from({ length: 11 }, (_, i) => i).map((i) => ({
        preference: i,
        count: studentsInLesson.reduce((acc, student) => {
            const pref = lessonPreferences.get(student) || 0;
            return acc + (pref === i ? 1 : 0);
        }, 0)
    }));

    return (
        <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedLesson(undefined)}
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 w-200 max-w-4xl mx-4 max-h-[80vh] min-h-150 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between rounded-t-lg">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200">Lesson Details</h3>
                    <button 
                        onClick={() => setSelectedLesson(undefined)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
                <div className="flex h-full">
                    <div className="w-1/2 p-6  border-r border-gray-200 dark:border-gray-600 items-center">
                    <div className="space-y-4">
                        {lessonInfoMap.map(([label, value], index) => {
                            return (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-300 font-medium">{label}:</span>
                                    <span className="text-gray-800 dark:text-gray-200">{value}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="items-center h-1/4 mt-10">
                        <ResponsiveContainer width={"100%"} height={"100%"}>
                            <BarChart data={preferenceHistogram} margin={{ top: 10, right: 20, left: 0, bottom: 15 }}>
                                <Bar dataKey="count" fill="#8884d8" />
                                <XAxis dataKey="preference">
                                    <Label value="Preference" offset={-10} position="insideBottom" />
                                </XAxis>
                                <YAxis />
                                <Tooltip />
                                <Legend verticalAlign="top" align="right"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>      
                    </div>
                    <div className="w-1/2 p-6">
                        {studentsInLesson.length > 0 ? (
                                <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                                    <div className="max-h-128 overflow-y-auto">
                                        <table className="w-full border-separate border-spacing-0">
                                            <thead className="sticky top-0 z-10">
                                                <tr className="bg-gray-100 dark:bg-gray-700">
                                                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-gray-900 dark:text-white font-medium">#</th>
                                                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-gray-900 dark:text-white font-medium">Student Name</th>
                                                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-gray-900 dark:text-white font-medium">Preference</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800">
                                                {studentsInLesson.map((student, index) => (
                                                    <tr key={index} className="hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors">
                                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">{index + 1}</td>
                                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">{student}</td>
                                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">{lessonPreferences.get(student)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm italic">No students assigned</p>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TimetablePage;
