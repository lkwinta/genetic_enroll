export type FileStatus = 'ready' | 'uploading' | 'success' | 'error';

export interface FileObject {
    file: File;
    name: string;
    size: string;
    status: FileStatus;
    data?: any[];
    error?: string;
}
