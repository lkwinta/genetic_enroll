import React from 'react';

import { Lesson } from '../interfaces/Lesson';
import ActionButton from './TimetableActionButton';
import FormInput from './TimetableFormInput';
import { Save, X } from 'lucide-react';

const formFields: {name: "subject" | "teacher" | "room" | "notes", placeholder: string, type: "input" | "textarea"}[] = [
  { name: 'subject', placeholder: 'Subject *', type: 'input' },
  { name: 'teacher', placeholder: 'Teacher', type: 'input' },
  { name: 'room', placeholder: 'Room', type: 'input' },
  { name: 'notes', placeholder: 'Notes', type: 'textarea' }
]

const EditingForm: React.FC<{
  lessonForm: Omit<Lesson, 'id'>;
  onInputChange: (field: keyof Omit<Lesson, 'id'>, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}> = ({ lessonForm, onInputChange, onSave, onCancel }) => (
  <div className="p-2 border-2 rounded bg-blue-50 border-blue-200 dark:bg-gray-800 dark:border-blue-600">
    <div className="space-y-2">
      {formFields.map(({name, placeholder, type}) => (
        <FormInput
        key={name}
        type={type}
        placeholder={placeholder}
        value={lessonForm[name]}
        onChange={(value) => onInputChange(name, value)}
      />
      ))} 

      <div className="flex gap-2">
        <ActionButton onClick={onSave} variant="save">
          <Save size={12} />
          Save
        </ActionButton>
        <ActionButton onClick={onCancel} variant="cancel">
          <X size={12} />
          Cancel
        </ActionButton>
      </div>
    </div>
  </div>
);

export default EditingForm;