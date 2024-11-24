import { User } from './entities/user.entity';

export interface UserRepository {
  findById(id: number): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  save(entity: User): Promise<User>;

  softDelete(id: number): Promise<boolean>;
}
