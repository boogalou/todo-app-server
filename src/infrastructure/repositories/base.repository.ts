import { Repository } from 'typeorm';
import { DatabaseException } from '../exceptions/databaseException';

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
      throw new DatabaseException(`Database operation failed. ${message}`);
    }
  }
}
