'use client';

import React, { useContext } from "react";
import { NextPage } from "next";
import Timetable from "@/app/components/Timetable/Timetable";
import { FilesContext } from "@/app/global_state";

const TimetablePage: NextPage = () => {
    const { scheduleFile } = useContext(FilesContext);

    return (
        <Timetable type='schedule' file={scheduleFile}/>
    );
}

export default TimetablePage;
