import React from 'react';

import '../styles/timetable.css';

type FormInputType = 'input' | 'textarea';

interface FormInputProps {
  type: FormInputType;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const FormInput: React.FC<FormInputProps> = ( {type, onChange, ...other}) => {
  if (type === 'textarea') {
    return (
      <textarea {...other}
        onChange={(e) => onChange(e.target.value)}
        className={"timetable-form-input resize-none h-16"}
      />
    );
  }
  
  return (
    <input {...other}
      type="text"
      onChange={(e) => onChange(e.target.value)}
      className="timetable-form-input"
    />
  );
};

export type { FormInputProps, FormInputType };
export default FormInput;