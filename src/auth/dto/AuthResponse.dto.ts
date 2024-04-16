import { AuthResponse } from '../../types';
import { ApiProperty } from '@nestjs/swagger';

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
