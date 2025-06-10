export type LessonFields = "subject" | "teacher" | "room" | "notes";

export type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface Lesson {
  subject: string;
  teacher: string;
  room: string;
  notes: string;
  day: Day;
  timeSlot: string;
  
  group_id?: number;
  capacity?: number;
  pointsPerCapacity?: number;
  pointsAssigned?: number;
  preference?: number;
  assigned?: boolean;
}

export interface LessonsList {
  [key: string]: Lesson[];
}
