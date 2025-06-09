export type FileStatus = 'ready' | 'uploading' | 'success' | 'error';

export interface FileObject<RowType> {
    file: File;
    name: string;
    size: string;
    status: FileStatus;
    data?: RowType[];
    error?: string;
}
