import { AuthMapper } from './auth-mapper';
import { User } from '../../../domain/entities/user.entity';
import { AuthResponseDto } from '../../dto/auth/auth-response.dto';
import { plainToInstance } from 'class-transformer';

export class AuthMapperImpl implements AuthMapper {
  toDto(entity: User): AuthResponseDto {
    return plainToInstance(AuthResponseDto, entity, { excludeExtraneousValues: true });
  }
}
