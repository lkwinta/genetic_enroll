import React from 'react';

import { Lesson, LessonFields } from '../interfaces/Lesson';
import ActionButton from './TimetableActionButton';
import FormInput, { FormInputType } from './TimetableFormInput';
import { Save, X } from 'lucide-react';

import '@/app/styles/timetable.css';

const formFields: {name: LessonFields, placeholder: string, type: FormInputType}[] = [
  { name: 'subject', placeholder: 'Subject *', type: 'input' },
  { name: 'teacher', placeholder: 'Teacher', type: 'input' },
  { name: 'room', placeholder: 'Room', type: 'input' },
  { name: 'notes', placeholder: 'Notes', type: 'textarea' }
]

interface EditingFormProps {
  lessonForm: Omit<Lesson, 'id'>;
  onInputChange: (field: keyof Omit<Lesson, 'id'>, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditingForm: React.FC<EditingFormProps> = ({ lessonForm, onInputChange, onSave, onCancel }) => (
  <div className="timetable-editing-form">
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

export type { EditingFormProps };
export default EditingForm;