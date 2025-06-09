import { TIME_SLOTS, DAYS} from "@/app/components/Timetable/components/TimetableConsts";
import { Lesson, LessonsList, Day } from "@/app/components/Timetable/interfaces/Lesson";
import { ColorClass } from "@/app/components/Timetable/components/TimetableLessonCard";
import { CSVInput, IndividualRowType, PreferencesRowType, ScheduleRowType } from "./ContextManager";

const DAY_MAP: Record<string, string> = {
  Pn: 'Monday',
  Wt: 'Tuesday',
  Sr: 'Wednesday',
  Cz: 'Thursday',
  Pt: 'Friday',
  Sb: 'Saturday',
  Nd: 'Sunday',
};


const normalizeHour = (timeStr: string): string => {
    const [hh, mm] = timeStr.split(":");
    return `${parseInt(hh, 10)}:${mm}`;
};

const findSlot = (start: string): string | null => {
    const normalized = normalizeHour(start);
    return TIME_SLOTS.find(slot => slot.startsWith(normalized)) ?? null;
};

const parseScheduleIntoLessons = (csv: CSVInput<ScheduleRowType>) => {
    if (csv.type != 'schedule') return { lessons: {}, subjectColorMap: {} };

    const newLessons: LessonsList = {};
    const subjects = new Set<string>();

    csv.csvData.forEach((row, idx) => {
        const dayKey = DAY_MAP[row.day];
        if (!dayKey || !DAYS.includes(dayKey)) {
            console.warn(`Nieznany dzień w wierszu ${idx + 1}:`, row.day);
            return { lessons: {}, subjectColorMap: {} };
        }
        const slot = findSlot(row.start_time);
        if (!slot) {
            console.warn(`Nieznany slot dla '${row.start_time}' (wiersz ${idx + 1})`);
            return { lessons: {}, subjectColorMap: {} };
        }

        const key = `${dayKey}-${slot}`;
        subjects.add(row.subject);

        const lesson: Lesson = {
            subject: row.subject,
            teacher: row.teacher,
            room: row.classroom,
            group_id: row.group_id,
            // capacity: row.capacity, TODO:
            notes: `${row.type || ''} ${row.group_id || ''}`.trim(),
            day: dayKey as Day,
            timeSlot: slot,
        };
        newLessons[key] = [...(newLessons[key] || []), lesson];
    });

    const subjectColorMap: Record<string, ColorClass> = {};
    const colors: ColorClass[] = ['purple', 'blue', 'green', 'yellow', 'orange', 'red', 'pink', 'teal'];

    subjects.entries().forEach(([subject], index) => {
        const colorIndex = index % colors.length;
        subjectColorMap[subject] = colors[colorIndex];
    });

    return {
        lessons: newLessons,
        subjectColorMap: subjectColorMap
    }
}

const parsePreferencesIntoLessons = (csv: CSVInput<PreferencesRowType>)  => {
    if (csv.type != 'preferences') return {};

    return {
        lessons: {},
        subjectColorMap: {}
    }
}

const parseStudentPreferences = (csv: CSVInput<PreferencesRowType>) => {

}


const parseIndividualIntoStudentsMap = (csv: CSVInput<IndividualRowType>)  => {
    if (csv.type != 'individual') return {};

    const studentsOnLessons: Record<string, string[]> = {};


    csv.csvData.forEach((row) => {
        const student = row[""];
        const entries = Object.entries(row);

        for (let i = 1; i < entries.length; i++) {
            const [subject, group] = entries[i];
            const id = `${subject}-${group}`;

            studentsOnLessons[id] = [...(studentsOnLessons[id] || []), student];
        }
    });
   
    
    return studentsOnLessons
}

const parseIndividualIntoStudentsAssignments = (csv: CSVInput<IndividualRowType>, selectedStudent: string) => {
    if (csv.type != 'individual') return [];

    let resultAssignments: [string, number][] = [];
    csv.csvData.forEach((row) => {
        const student = row[""];
        const entries = Object.entries(row);

        if (student === selectedStudent) {
            const assignments: [string, number][] = [];
            for (let i = 1; i < entries.length; i++) {
                const [subject, group] = entries[i];
                if (group !== 0) { // Assuming 0 means no assignment
                    assignments.push([subject, group as number]);
                }
            }

            resultAssignments = assignments;
        }
    });

    return resultAssignments;
}

export { parseScheduleIntoLessons, parsePreferencesIntoLessons, parseIndividualIntoStudentsMap, parseStudentPreferences, parseIndividualIntoStudentsAssignments };