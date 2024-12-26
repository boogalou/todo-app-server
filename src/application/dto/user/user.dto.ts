import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly username: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly userPic: string;
}
