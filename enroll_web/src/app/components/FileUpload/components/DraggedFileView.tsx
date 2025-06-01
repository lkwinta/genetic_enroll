import { FC, JSX } from "react";
import { AlertCircle, Check, X, File } from "lucide-react";
import { FileObject } from "../interfaces/File";

interface DraggedFileViewProps {
  file?: FileObject;
  onFileChange: (file?: FileObject) => void;
}

const DraggedFileView: FC<DraggedFileViewProps> = ({ file, onFileChange }) => {
  const getStatusColor = (status: FileObject['status']): string => {
    switch (status) {
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'uploading': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: FileObject['status']): JSX.Element => {
    switch (status) {
      case 'success': return <Check size={16} />;
      case 'error': return <AlertCircle size={16} />;
      case 'uploading': return <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />;
      default: return <File size={16} />;
    }
  };

  const getStatusText = (status: FileObject['status']): string => {
    switch (status) {
      case 'uploading': return 'Processing...';
      case 'success': return 'Processed';
      case 'error': return 'Error';
      default: return 'Ready';
    }
  };

  const removeFile = (): void => {
    onFileChange(undefined);
  };


  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl" role="img" aria-label="CSV file">
            📊
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 dark:text-white truncate">
              {file?.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {file?.size}
            </p>
            {file!.error && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {file?.error}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 ${getStatusColor(file!.status)}`}>
            {getStatusIcon(file!.status)}
            <span className="text-sm font-medium">
              {getStatusText(file!.status)}
            </span>
          </div>

          <button
            onClick={removeFile}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors duration-200 text-gray-500 hover:text-red-500"
            type="button"
            aria-label={`Remove ${file?.name}`}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export type { DraggedFileViewProps };
export default DraggedFileView;