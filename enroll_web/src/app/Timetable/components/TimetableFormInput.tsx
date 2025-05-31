import React from 'react';

interface FormInputProps {
  type: 'input' | 'textarea';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const FormInput: React.FC<FormInputProps> = ( {type, onChange, ...other}) => {
  const baseClasses = "w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400";
  
  if (type === 'textarea') {
    return (
      <textarea {...other}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseClasses} resize-none h-16`}
      />
    );
  }
  
  return (
    <input {...other}
      type="text"
      onChange={(e) => onChange(e.target.value)}
      className={baseClasses}
    />
  );
};

export default FormInput;