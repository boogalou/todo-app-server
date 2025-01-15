import { Global, Module } from '@nestjs/common';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';
import { File_Storage_Repository, File_Storage_Service } from '../../shared/tokens';
import { FileStorageRepositoryImpl } from '../repositories/file-storage.repository.impl';
import { FileStorageServiceImpl } from '../../application/services/impl/file-storage.service.Impl';

@Global()
@Module({
  providers: [
    {
      provide: 'MINIO_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new Client({
          endPoint: configService.get('MINIO_URL') || 'localhost',
          port: configService.get('MINIO_PORT') || 9000,
          useSSL: configService.get('MINIO_USE_SSL') === 'true',
          accessKey: configService.get('MINIO_USER'),
          secretKey: configService.get('MINIO_PASSWORD'),
        });
      },

      inject: [ConfigService],
    },
    {
      provide: File_Storage_Repository,
      useClass: FileStorageRepositoryImpl,
    },
    {
      provide: File_Storage_Service,
      useClass: FileStorageServiceImpl,
    },
  ],

  exports: ['MINIO_CLIENT', File_Storage_Service],
})
export class FileStorageModule {}
