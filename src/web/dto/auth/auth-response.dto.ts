import { Expose } from 'class-transformer';

export class AuthResponseDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly email: string;

  @Expose()
  readonly username: string;

  @Expose()
  readonly userPic: string | null;

  @Expose()
  readonly accessToken: string;
}
