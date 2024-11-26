import { LoginUserDto } from '../../web/dto/auth/login-user.dto';
import { AuthResponseDto } from '../../web/dto/auth/auth-response.dto';

export interface AuthService {
  login(dto: LoginUserDto): Promise<AuthResponseDto>;

  refresh(token: string): Promise<AuthResponseDto>;
}
