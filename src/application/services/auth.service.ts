import { LoginUserDto } from '../dto/auth/login-user.dto';
import { AuthResponseDto } from '../dto/auth/auth-response.dto';

export interface AuthService {
  login(dto: LoginUserDto): Promise<AuthResponseDto>;

  refresh(token: string): Promise<AuthResponseDto>;
}
