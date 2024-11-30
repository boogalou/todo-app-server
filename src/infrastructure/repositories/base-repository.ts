import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export abstract class BaseRepository<T> {
  protected constructor(protected readonly repository: Repository<T>) {}

  protected async commonHandler<U>(
    method: () => Promise<U>,
    logMessage: string,
    entityId?: number,
  ): Promise<U> {
    try {
      return await method();
    } catch (err) {
      const message = `${logMessage} ${entityId ? `ID: ${entityId}` : ''}. Reason: ${err.message}`;
      throw new Error(`Database operation failed. ${err.message}`);
    }
  }
}
