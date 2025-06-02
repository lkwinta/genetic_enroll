import { FileObject } from  "@/app/components/FileUpload/interfaces/File";
import { TIME_SLOTS, DAYS} from "@/app/components/Timetable/components/TimetableConsts";
import { Lesson, LessonsList, Day } from "@/app/components/Timetable/interfaces/Lesson";
import { ColorClass } from "@/app/components/Timetable/components/TimetableLessonCard";

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

const parseScheduleIntoLessons = (file?: FileObject) => {
    if (!file || file.status !== 'success') return { lessons: {}, subjectColorMap: {} };

    const newLessons: LessonsList = {};
    const subjects = new Set<string>();

    file!.data!.forEach((row, idx) => {
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

const parsePreferencesIntoLessons = (file?: FileObject)  => {
    return {
        lessons: {},
        subjectColorMap: {}
    }
}


const parseIndividualIntoStudentsMap = (individualFile?: FileObject)  => {
    if (!individualFile || individualFile.status !== 'success') return {};

    const studentsOnLessons: Record<string, string[]> = {};


    individualFile!.data!.forEach((row) => {
        const student = row[""];
        console.log(row)
    });
   
    
    return {
    }
}




export { parseScheduleIntoLessons, parsePreferencesIntoLessons, parseIndividualIntoStudentsMap}