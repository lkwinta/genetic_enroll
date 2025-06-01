'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { LessonsState, Lesson } from '../interfaces/Lesson';
import { DAYS, TIME_SLOTS } from './TimetableConsts';

interface Props {
  onImport: (l: LessonsState) => void;
}

const DAY_MAP: Record<string, string> = {
  Pn: 'Monday',
  Wt: 'Tuesday',
  Sr: 'Wednesday',
  Cz: 'Thursday',
  Pt: 'Friday',
  Sb: 'Saturday',
  Nd: 'Sunday',
};

export default function CsvDropdown({ onImport }: Props) {
  const [files, setFiles] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    fetch('/api/csv-list')
      .then(r => r.json())
      .then((fileList: string[]) => setFiles(fileList))
  }, []);

  const normalizeHour = (timeStr: string): string => {
    const [hh, mm] = timeStr.split(":");
    return `${parseInt(hh, 10)}:${mm}`;
  };

  const findSlot = (start: string): string | null => {
    const normalized = normalizeHour(start);
    return TIME_SLOTS.find(slot => slot.startsWith(normalized)) ?? null;
  };

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const file = e.target.value;
    setSelected(file);

    if (!file) {
      return;
    }

    const text = await fetch(`/csv/${file}`).then(r => {
      return r.text();
    });

    const { data } = Papa.parse<Record<string, string>>(text, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
    });

    const newLessons: LessonsState = {};
    data.forEach((row, idx) => {
      const dayKey = DAY_MAP[row.day];
      if (!dayKey || !DAYS.includes(dayKey)) {
        console.warn(`❌ Nieznany dzień w wierszu ${idx + 1}:`, row.day);
        return;
      }
      const slot = findSlot(row.start_time);
      if (!slot) {
        console.warn(
          `❌ Nieznany slot dla '${row.start_time}' (wiersz ${idx + 1})`
        );
        return;
      }

      const key = `${dayKey}-${slot}`;

      const lesson: Lesson = {
        id: crypto.randomUUID(),
        subject: row.subject,
        teacher: row.teacher,
        room: row.classroom,
        notes: `${row.type || ''} ${row.group_id || ''}`.trim(),
      };
      newLessons[key] = [...(newLessons[key] || []), lesson];
    });

    onImport(newLessons);
  }

  return (
    <div>
      <label className="block font-semibold mb-2">Wybierz plik CSV:</label>
      <select
        value={selected}
        onChange={handleChange}
        className="border px-2 py-1 w-full"
      >
        <option value="">— wybierz —</option>
        {files.map((file) => (
          <option key={file} value={file}>
            {file}
          </option>
        ))}
      </select>
    </div>
  );
}
