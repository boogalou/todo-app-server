import { ApiProperty } from '@nestjs/swagger';
import { AuthResponse } from '../../shared/types';

export class AuthResponseDto implements AuthResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  accessToken: string;
}
