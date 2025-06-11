import React from "react";
import { Lesson } from "../../Timetable/interfaces/Lesson";

export interface LessonDetailsBlurBackgroundProps {
    setSelectedLesson: (lesson?: Lesson) => void;
    children: React.ReactNode;
}

const LessonDetailsBlurBackground: React.FC<LessonDetailsBlurBackgroundProps> = ({ setSelectedLesson, children }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedLesson(undefined)}
        >
            {children}
        </div>
    );
};

export default LessonDetailsBlurBackground;