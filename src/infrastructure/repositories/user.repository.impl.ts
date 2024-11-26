import { Inject, Injectable, InternalServerErrorException, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRepository } from '../../domain/repositories/user.repository';
import { Logger_Service } from '../../shared/tokens';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    @Inject(Logger_Service)
    private readonly logger: LoggerService,
  ) {}

  public async findById(userId: number): Promise<User | null> {
    try {
      return await this.repository.findOne({ where: { id: userId } });
    } catch (err) {
      this.logger.error(
        `Error occurred while retrieving user with ID ${userId}. Reason: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException(
        `Unable to retrieve user with ID ${userId}. Please try again later.`,
      );
    }
  }

  public async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.repository.findOne({ where: { email } });
    } catch (err) {
      this.logger.error(
        `Error occurred while retrieving user with email "${email}". Reason: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException(
        `Unable to retrieve user with email "${email}". Please try again later.`,
      );
    }
  }

  public async save(user: User): Promise<User> {
    try {
      return await this.repository.save(user);
    } catch (err) {
      this.logger.error(
        `Error occurred while saving user. User details: ${JSON.stringify(user)}. Reason: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException(
        `Unable to save user. Please check the provided data and try again.`,
      );
    }
  }

  public async softDelete(id: number): Promise<boolean> {
    try {
      const result = await this.repository.softDelete(id);
      if (result.affected === 0) {
        this.logger.warn(`Attempted to delete user with ID ${id}, but no matching user was found.`);
        throw new InternalServerErrorException(
          `No user found with ID ${id}. Deletion was not performed.`,
        );
      }
      return true;
    } catch (err) {
      this.logger.error(
        `Error occurred while attempting to soft delete user with ID ${id}. Reason: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException(
        `Unable to delete user with ID ${id}. Please try again later.`,
      );
    }
  }

  public async isExists(email: string): Promise<boolean> {
    try {
      return this.repository.exists({ where: { email } });
    } catch (err) {
      this.logger.error(
        `Error occurred while checking existence of user with email "${email}". Reason: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException(
        `Unable to check existence of user with email "${email}". Please try again later.`,
      );
    }
  }
}
