export type FileStatus = 'ready' | 'uploading' | 'success' | 'error';

export interface FileObject {
    id: string;
    file: File;
    name: string;
    size: string;
    status: FileStatus;
    data?: any[];
    error?: string;
}
