import { FileStorageService } from '../file-storage.service';
import * as Buffer from 'node:buffer';
import { Inject, Injectable } from '@nestjs/common';
import { File_Storage_Repository } from '../../../shared/tokens';
import { FileStorageRepository } from '../../../domain/repositories/file-storage.repository';

@Injectable()
export class FileStorageServiceImpl implements FileStorageService {
  constructor(
    @Inject(File_Storage_Repository)
    private readonly repository: FileStorageRepository,
  ) {}

  public async createBucket(bucket: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  public async deleteFile(buket: string, fileName: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  public async downloadFile(buket: string, fileName: string): Promise<Buffer> {
    return Promise.resolve(undefined);
  }

  public async uploadFile(bucket: string, fileName: string, fileBuffer: Buffer): Promise<void> {
    return this.repository.uploadFile(bucket, fileName, fileBuffer);
  }
}
