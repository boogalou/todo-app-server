export class DatabaseException extends Error {
  constructor(
    message: string,
    public readonly originalError?: Error,
  ) {
    super(message);
    this.name = 'DatabaseException';
  }

  if(originalError) {
    this.stack = originalError;
  }
}
