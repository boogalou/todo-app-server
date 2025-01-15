export interface FileStorageService {
  uploadFile(bucket: string, fileName: string, fileBuffer: Buffer): Promise<void>;

  downloadFile(buket: string, fileName: string): Promise<Buffer>;

  deleteFile(buket: string, fileName: string): Promise<void>;

  createBucket(bucket: string): Promise<void>;
}
