import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

export abstract class BaseRepository<E> {
  protected constructor(protected readonly repository: Repository<E>) {}

  protected async handler<U>(
    method: () => Promise<U>,
    logMessage: string,
    entityId?: number,
  ): Promise<U> {
    try {
      return await method();
    } catch (err) {
      const message = `${logMessage} ${entityId ? `ID: ${entityId}` : ''}. Reason: ${err.message}`;
      throw new InternalServerErrorException(`Database operation failed. ${message}`);
    }
  }
}
