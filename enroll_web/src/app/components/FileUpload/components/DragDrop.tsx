import { FC } from "react";
import { FileObject } from "../interfaces/File";
import DraggedFileView from "./DraggedFileView";
import EmptyFileView from "./EmptyFileView";
import DragDropHeader from "./DragDropHeader";

interface DragDropProps {
  title: string;
  description: string;
  file?: FileObject;
  onFileChange: (file?: FileObject) => void;

  viewButtonEnabled?: boolean;
  viewButtonOnClick?: () => void;
}

const DragDropFile: FC<DragDropProps> = ({ title, description, file, onFileChange, viewButtonEnabled = false, viewButtonOnClick }) => {
  return (
    <div className="rounded-lg shadow-md border border-gray-300 dark:border-gray-600 overflow-hidden bg-white dark:bg-gray-800">
      <DragDropHeader title={title} viewButtonEnabled={!!file && viewButtonEnabled} viewButtonOnClick={viewButtonOnClick} />

      {!file ?
        <EmptyFileView
          description={description}
          onFileChange={onFileChange}
        />
        :
        <DraggedFileView
          file={file}
          onFileChange={onFileChange}
        />
      }
    </div>
  );
};

export type { DragDropProps }
export default DragDropFile;