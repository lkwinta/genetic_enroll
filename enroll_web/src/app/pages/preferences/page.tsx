'use client';

import React, { useContext } from "react";
import { NextPage } from "next";
import Timetable from "@/app/components/Timetable/Timetable";
import { FilesContext } from "@/app/global_state";
import { parsePreferencesIntoLessons } from "@/app/utils/TimetableParser";

const TimetablePage: NextPage = () => {
    const { preferencesFile } = useContext(FilesContext);

    if (!preferencesFile) {
        return (
            <div className="p-6 max-w-8xl mx-auto">
                <h1 className="text-2xl font-bold">No preferences file uploaded</h1>
                <p>Please upload a preference file to view the timetable.</p>
            </div>
        );
    }

    const { lessons, subjectColorMap } = parsePreferencesIntoLessons(preferencesFile);

    return (
        <Timetable
            lessons={lessons}
            header="Preferences"
            coloringFunction={(lesson) => 'teal'}
        />
    );
}

export default TimetablePage;
