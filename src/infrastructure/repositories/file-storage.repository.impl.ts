import { Inject, Injectable } from '@nestjs/common';
import { FileStorageRepository } from '../../domain/repositories/file-storage.repository';
import { Client } from 'minio';

@Injectable()
export class FileStorageRepositoryImpl implements FileStorageRepository {
  constructor(
    @Inject('MINIO_CLIENT')
    private readonly client: Client,
  ) {}

  async uploadFile(bucket: string, fileName: string, fileBuffer: Buffer): Promise<void> {
    await this.client.putObject(bucket, fileName, fileBuffer);
  }

  async downloadFile(bucket: string, fileName: string): Promise<Buffer> {
    const stream = await this.client.getObject(bucket, fileName);

    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  async deleteFile(bucket: string, fileName: string): Promise<void> {
    await this.client.removeObject(bucket, fileName);
  }

  async createBucket(bucket: string): Promise<void> {
    const exists = await this.client.bucketExists(bucket);
    if (!exists) {
      await this.client.makeBucket(bucket, '');
    }
  }
}
