import React from 'react';
import { Bar, BarChart, Label, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface LessonDetailsPreferencesHistogramProps {
    lessonPreferences: Map<string, number>;
    studentsInLesson: string[];
    isDark: boolean;
}

const LessonDetailsPreferencesHistogram: React.FC<LessonDetailsPreferencesHistogramProps> = ({ lessonPreferences, studentsInLesson, isDark }) => {
    const barColor = isDark ? 'rgb(151, 191, 191)' : 'rgb(46, 179, 179)';
    const textColor = isDark ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)';
    const tooltipStyle: React.CSSProperties = {
        color: isDark ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)',
        backgroundColor: isDark ? 'rgba(10, 10, 10, 0.5)' : 'rgba(255, 255, 255, 0.8)',
        borderColor: isDark ? 'rgba(180, 180, 180, 0.5)' : 'rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
    };


    const preferenceHistogram = Array.from({ length: 11 }, (_, i) => i).map((i) => ({
        preference: i,
        count: studentsInLesson.reduce((acc, student) => {
            const pref = lessonPreferences.get(student) || 0;
            return acc + (pref === i ? 1 : 0);
        }, 0)
    }));    
    

    return (
        <ResponsiveContainer width={"100%"} height={"100%"}>
            <BarChart data={preferenceHistogram} margin={{ top: 10, right: 20, left: 0, bottom: 15 }}>
                <Bar dataKey="count" fill={barColor}/>
                <XAxis dataKey="preference" stroke={textColor}>
                    <Label value="Preference" offset={-10} fill={textColor} position="insideBottom" />
                </XAxis>
                <YAxis stroke={textColor}/>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend verticalAlign="top" align="right"/>
            </BarChart>
        </ResponsiveContainer>
    );
}

export default LessonDetailsPreferencesHistogram;