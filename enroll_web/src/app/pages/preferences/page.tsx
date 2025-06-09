'use client';

import React, { useContext } from "react";
import { NextPage } from "next";
import Timetable from "@/app/components/Timetable/Timetable";
import { parsePreferencesIntoLessons } from "@/app/utils/TimetableParser";
import { DataContext } from "@/app/utils/ContextManager";

const TimetablePage: NextPage = () => {
    const { preferences } = useContext(DataContext);

    if (!preferences) {
        return (
            <div className="p-6 max-w-8xl mx-auto">
                <h1 className="text-2xl font-bold">No preferences file uploaded</h1>
                <p>Please upload a preference file to view the timetable.</p>
            </div>
        );
    }

    const { lessons } = parsePreferencesIntoLessons(preferences);

    return (
        <Timetable
            lessons={lessons}
            header="Preferences"
            coloringFunction={() => 'teal'}
        />
    );
}

export default TimetablePage;
