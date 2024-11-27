import { User } from '../../../domain/entities/user.entity';
import { AuthResponseDto } from '../../dto/auth/auth-response.dto';

export interface AuthMapper {
  toDto(entity: User): AuthResponseDto;
}
