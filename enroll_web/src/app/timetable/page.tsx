import Timetable from "@/app/components/Timetable/Timetable";

export default function TimetablePage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Widok planu zajęć</h1>
      <Timetable />
    </main>
  );
}