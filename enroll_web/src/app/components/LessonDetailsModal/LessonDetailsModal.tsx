import { useContext, useEffect, useRef } from "react";

import { Lesson } from "../Timetable/interfaces/Lesson";
import { parsePreferencesByLesson } from "@/app/utils/TimetableParser";
import LessonDetailsPreferencesHistogram from "./components/LessonDetailsPreferencesHistogram";
import { DataContext } from "@/app/utils/ContextManager";
import LessonDetailsStudentList from "./components/LessonDetailsStudentList";
import LessonDetailsList from "./components/LessonDetailsList";
import LessonDetailsBlurBackground from "./components/LessonDetailsBlurBackground";
import LessonDetailsWindow from "./components/LessonDetailsWindow";

interface LessonDetailsModalProps {
    studentOnLessons: Record<string, string[]>;
    selectedLesson?: Lesson;
    setSelectedLesson: (lesson?: Lesson) => void;
}

const LessonDetailsModal: React.FC<LessonDetailsModalProps> = ({studentOnLessons, selectedLesson, setSelectedLesson}) => {
    const { preferences } = useContext(DataContext);
    const isDark = useRef<boolean>(false);
    useEffect(() => {
        isDark.current = window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    if (!selectedLesson || !preferences) return (<></>);
    
    const studentsInLesson = studentOnLessons[`${selectedLesson.subject}-${selectedLesson.group_id}`] || [];

    const lessonPreferences = parsePreferencesByLesson(preferences, selectedLesson);

    return (
        <LessonDetailsBlurBackground setSelectedLesson={setSelectedLesson}>
            <LessonDetailsWindow setSelectedLesson={setSelectedLesson}>
                <div className="flex h-full">
                    <div className="w-1/2 p-6  border-r border-gray-200 dark:border-gray-600 items-center">
                    <LessonDetailsList 
                        selectedLesson={selectedLesson}
                        studentsInLesson={studentsInLesson}
                    />
                    <div className="items-center h-1/4 mt-10">
                       <LessonDetailsPreferencesHistogram 
                            lessonPreferences={lessonPreferences}
                            studentsInLesson={studentsInLesson}
                            isDark={isDark.current}
                        />
                    </div>      
                    </div>
                    <div className="w-1/2 p-6">
                       <LessonDetailsStudentList
                            lessonPreferences={lessonPreferences}
                            studentsInLesson={studentsInLesson}/>
                    </div>
                </div>
            </LessonDetailsWindow>
        </LessonDetailsBlurBackground>
    )
}

export default LessonDetailsModal;