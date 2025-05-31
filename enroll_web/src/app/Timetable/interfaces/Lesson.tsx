export interface Lesson {
  id: string;
  subject: string;
  teacher: string;
  room: string;
  notes: string;
}

export interface LessonsState {
  [key: string]: Lesson[];
}
