export interface LoggerService {
  info(message: any, meta?: unknown[]): void;

  warn(message: any, meta?: unknown[]): void;

  error(message: any, meta?: unknown[]): void;

  debug(message: any, meta?: unknown[]): void;
}
