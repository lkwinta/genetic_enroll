import { Upload } from 'lucide-react';
import React, { useState, useRef, FC, DragEvent, ChangeEvent } from 'react';
import { FileObject } from '../interfaces/File';

interface EmptyFileViewProps {
  description: string;
  onFileChange: (file?: FileObject) => void;
}

const EmptyFileView: FC<EmptyFileViewProps> = ({ description, onFileChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);


  const handleFileInput = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files || e.target.files.length === 0) return;
    handleFile(e.target.files[0]);
  };

  const handleFile = (newFile: File): void => {
    // Check if file is CSV
    if (!newFile.type.includes('csv') && !newFile.name.toLowerCase().endsWith('.csv')) {
      alert('Please select a CSV file only.');
      return;
    }

    const fileObj: FileObject = {
      id: Math.random().toString(36).substr(2, 9),
      file: newFile,
      name: newFile.name,
      size: formatFileSize(newFile.size),
      status: 'ready'
    };

    onFileChange(fileObj);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFile(droppedFiles[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      className={`
            border-2 border-dashed transition-all duration-300 m-4
            ${isDragOver
          ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500'
          : 'border-gray-300 dark:border-gray-600'
        }
          `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-6 text-center">
        <div className="mb-3">
          <Upload
            size={32}
            className={`mx-auto ${isDragOver ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`}
          />
        </div>
        <h4 className="font-medium text-gray-800 dark:text-white mb-2">
          {description}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          Drop CSV file here or click to browse
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
          type="button"
        >
          Choose File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInput}
          className="hidden"
          accept=".csv,text/csv"
        />
      </div>
    </div>
  );
};

export type { EmptyFileViewProps };
export default EmptyFileView;